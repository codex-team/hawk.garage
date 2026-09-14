import { describe, expect, it } from 'vitest';
import { marked, type Token } from 'marked';
import { createMarkdownLexer } from './markdown';

/**
 * Describe tokens by everything except the source they were read from.
 * @param tokens - tokens to describe
 * @returns comparable description
 */
function shape(tokens: Token[]): string {
  return JSON.stringify(tokens, (key, value) => (key === 'raw' ? undefined : value));
}

/**
 * Stream a source character by character and compare blocks with a whole parse of each prefix.
 * @param source - markdown text
 * @returns first prefix where blocks differ, or null
 */
async function firstDivergence(source: string): Promise<string | null> {
  const lexer = await createMarkdownLexer();

  for (let at = 0; at < source.length; at++) {
    const prefix = source.slice(0, at + 1);

    if (shape(lexer.append(source[at])) !== shape(marked.lexer(prefix))) {
      return prefix;
    }
  }

  return null;
}

const TRICKY = {
  'a setext heading': 'Title\n=====\n\nbody text here\n',
  'a fence that closes': 'intro\n\n```ts\nconst x = 1;\nif (a) { b(); }\n```\n\nafter\n',
  'a list broken by blank lines': '- one\n\n- two\n\n- three\n\ntail paragraph\n',
  'a list numbered past nine': '1. one\n2. two\n10. ten\n\nafter\n',
  'a fence nested in a list': '1. do this:\n\n   ```ts\n   const x = 1;\n   ```\n\n2. then this\n',
  'a table gaining rows': 'text\n\n| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\nafter\n',
  'a lazily continued blockquote': '> quoted line\ncontinued lazily\n\nafter\n',
  'an html block': '<div>\nraw\n</div>\n\nafter\n',
  'a list turning loose': '- one\n\n  second para of one\n\n- two\n',
  'a nested list': '- a\n  - b\n    - c\n- d\n\nafter\n',
  'indented code across a blank line': '    code one\n\n    code two\n\nafter\n',
  'an empty marker before a bullet': '|---|\n1.\n- a\n',
  'a realistic answer': [
    '## Cause', '', 'The `subscription` field is **not** set, so the guard reads `undefined`.',
    '', '1. Check the migration ran:', '', '   ```sql', '   SELECT count(*) FROM workspaces;', '   ```',
    '', '2. Backfill the missing rows.', '', '> Only active workspaces are backfilled.', '',
    '| field | value |', '|---|---|', '| status | active |', '',
    '```ts', 'if (workspace.subscription?.status === "active") {', '  return charge(workspace);', '}', '```', '', 'Done.', '',
  ].join('\n'),
};

/**
 * Lines per document in the brute-force test.
 */
const BRUTE_FORCE_LINES = 3;

/**
 * Lines that start or look like other block constructs.
 */
const AMBIGUOUS_LINES = ['', 'text', '1.', '2.', '- a', '---', '| a |', '|---|', '1', '```', '> q', '  x'];

/**
 * Build every document of ambiguous lines.
 * @param lines - lines per document
 * @yields one document per combination
 */
function* combinations(lines: number): Generator<string> {
  const at = new Array(lines).fill(0);

  for (;;) {
    yield at.map(index => AMBIGUOUS_LINES[index]).join('\n') + '\n';

    let position = lines - 1;

    while (position >= 0 && ++at[position] === AMBIGUOUS_LINES.length) {
      at[position] = 0;
      position--;
    }

    if (position < 0) {
      return;
    }
  }
}

describe('createMarkdownLexer', () => {
  it.each(Object.entries(TRICKY))('should lex %s like a whole parse, character by character', async (_case, source) => {
    expect(await firstDivergence(source)).toBeNull();
  });

  it('should settle no block that a later character rewrites', async () => {
    const diverged: string[] = [];

    for (const document of combinations(BRUTE_FORCE_LINES)) {
      if (await firstDivergence(document) !== null) {
        diverged.push(document);
      }
    }

    expect(diverged).toEqual([]);
  });

  it('should lex the whole answer on reparse', async () => {
    const source = '|---|\n1.\n- a\n';
    const lexer = await createMarkdownLexer();

    for (const character of source) {
      lexer.append(character);
    }

    expect(shape(lexer.reparse())).toBe(shape(marked.lexer(source)));
  });

  it('should keep the identity of a settled block', async () => {
    const lexer = await createMarkdownLexer();

    lexer.append('# Title\n\nfirst paragraph\n\nsecond paragraph\n\nthird paragraph\n\nfourth paragraph\n\n');

    const [heading] = lexer.append('fifth paragraph, long enough to push the heading past the margin\n\n');
    const [headingAgain] = lexer.append('and more text after that\n');

    expect(headingAgain).toBe(heading);
  });
});
