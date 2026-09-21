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
 * A line that arrives later can still change the block above it, so a block is lexed again until
 * enough text follows it. `append` returns the blocks read so far and keeps the object of a block
 * that has not changed. Text far below a block can change it as well, so `reparse` reads the whole
 * answer once the stream ends.
 */
export interface IncrementalLexer {
  /**
   * Append a fragment and return every block to render.
   */
  append(delta: string): Token[];

  /**
   * Lex the whole answer again, replacing blocks settled too early.
   */
  reparse(): Token[];
}

/**
 * Measure the source a run of tokens was read from.
 * @param tokens - tokens in reading order
 * @returns combined source length
 */
function rawLength(tokens: Token[]): number {
  return tokens.reduce((length, token) => length + token.raw.length, 0);
}

/**
 * Count leading tokens that are lexed no more.
 * @param tokens - tokens of the unsettled tail
 * @returns how many of them are settled
 */
function countSettled(tokens: Token[]): number {
  let cut = tokens.length;
  let content = 0;

  while (cut > 0 && content < SETTLE_BLOCKS) {
    cut--;

    if (tokens[cut].type !== 'space') {
      content++;
    }
  }

  while (cut > 0 && rawLength(tokens.slice(cut)) < SETTLE_CHARS) {
    cut--;
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
  let source = '';
  let tail = '';

  return {
    append(delta: string): Token[] {
      source += delta;
      tail += delta;

      const tokens = marked.lexer(tail);
      const cut = countSettled(tokens);

      if (cut > 0) {
        settled.push(...tokens.slice(0, cut));

        /**
         * Rebuilt from raws: marked normalizes line endings, so source offsets don't match.
         */
        tail = tokens.slice(cut).map(token => token.raw)
          .join('');
      }

      return [...settled, ...tokens.slice(cut)];
    },
    reparse(): Token[] {
      return marked.lexer(source);
    },
  };
}
