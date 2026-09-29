import type { Token } from 'marked';

/**
 * Content blocks that must follow a block before it is lexed no more.
 */
const SETTLE_BLOCKS = 3;

/**
 * Characters that must follow a block before it is lexed no more.
 */
const SETTLE_CHARS = 64;

/**
 * Lexer of a streamed markdown answer.
 *
 * Blocks with enough following text retain their identity between appends. A distant link
 * definition can still change a settled reference, so reparse the complete answer at the end,
 * including after a transport failure. Reparse preserves tokens whose content did not change.
 *
 * Settling happens only between top-level blocks. An open fence, list or table is re-lexed
 * from its start on every append; the look-behind limits do not bound that block's size.
 */
export interface IncrementalLexer {
  /**
   * Append a fragment and return every block to render.
   */
  append(delta: string): Token[];

  /**
   * Finish by lexing the whole answer, correcting blocks settled before a distant definition.
   */
  reparse(): Token[];
}

/**
 * Count leading tokens with enough following content to settle.
 * @param tokens - tokens of the unsettled tail
 * @returns how many of them may be settled
 */
function countSettled(tokens: Token[]): number {
  let cut = tokens.length;
  let content = 0;
  let length = 0;

  while (cut > 0 && (content < SETTLE_BLOCKS || length < SETTLE_CHARS)) {
    const token = tokens[--cut];

    length += token.raw.length;

    if (token.type !== 'space') {
      content++;
    }
  }

  return cut;
}

/**
 * Create a lexer that lexes only the unsettled tail of a streamed answer.
 * @returns lexer keeping settled blocks between fragments
 */
export async function createIncrementalLexer(): Promise<IncrementalLexer> {
  const { marked } = await import('marked');
  const settled: Token[] = [];
  const definitions: Record<string, { href: string;
    title: string | null; }> = Object.create(null);
  let source = '';
  let settledOffset = 0;
  let previousEndedWithCR = false;
  let blocks: Token[] = [];

  return {
    append(delta: string): Token[] {
      if (!delta) {
        return blocks;
      }

      // Match marked's newline normalization even when CRLF straddles two appends.
      const continuation = previousEndedWithCR && delta.startsWith('\n') ? delta.slice(1) : delta;

      previousEndedWithCR = delta.endsWith('\r');
      source += continuation.replace(/\r\n?/g, '\n');

      const lexer = new marked.Lexer();

      Object.assign(lexer.tokens.links, definitions);

      const tokens = lexer.lex(source.slice(settledOffset));
      const candidateCount = countSettled(tokens);
      let cut = 0;

      while (cut < candidateCount) {
        const token = tokens[cut];

        // Some raws contain synthetic newlines, and duplicate definitions can be omitted.
        // Only advance across a prefix that matches the actual normalized source.
        if (!source.startsWith(token.raw, settledOffset)) {
          break;
        }

        settledOffset += token.raw.length;
        settled.push(token);
        void marked.walkTokens([token], (child) => {
          if (child.type === 'def' && definitions[child.tag] === undefined) {
            definitions[child.tag] = { href: child.href,
              title: child.title };
          }
        });
        cut++;
      }

      // A fresh array publishes the change to Vue; settled token objects remain shared.
      blocks = settled.concat(tokens.slice(cut));

      return blocks;
    },
    reparse(): Token[] {
      blocks = marked.lexer(source).map((token, index) => {
        const previous = blocks[index];

        return previous && JSON.stringify(previous) === JSON.stringify(token) ? previous : token;
      });

      return blocks;
    },
  };
}
