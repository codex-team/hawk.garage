import { beforeAll, describe, expect, it } from 'vitest';
import {
  getMarkdownRenderer,
  getMarkdownStreamRenderer,
  splitStringIntoTextAndCodeSegments,
  wrapWordsInHtml,
  type MarkdownNode
} from './markdown';

let renderMarkdown: (text: string) => string;

beforeAll(async () => {
  renderMarkdown = await getMarkdownRenderer();
});

/**
 * Render markdown into the DOM the dialog injects with v-html.
 * @param source - markdown text
 * @returns element holding the rendered result
 */
function render(source: string): HTMLElement {
  const host = document.createElement('div');

  host.innerHTML = renderMarkdown(source);

  return host;
}

/**
 * Feed a source through the streaming renderer in fixed-size chunks.
 * @param source - markdown text
 * @param chunkSize - characters per append call
 * @returns nodes left after the stream is finished
 */
async function stream(source: string, chunkSize: number): Promise<MarkdownNode[]> {
  const renderer = await getMarkdownStreamRenderer();

  for (let at = 0; at < source.length; at += chunkSize) {
    renderer.append(source.slice(at, at + chunkSize));
  }

  return renderer.finish();
}

/**
 * Flatten nodes to the content they put on screen.
 * @param nodes - rendered nodes
 * @returns rendered content as one string
 */
function content(nodes: MarkdownNode[]): string {
  return nodes
    .map(node => (node.type === 'code'
      ? `[${node.lang}]${node.lines.map(line => line.content).join('\n')}`
      : node.html))
    .join('');
}

const ANSWER = [
  '## Cause',
  '',
  'The `subscription` field is not set.',
  '',
  '```ts',
  'if (workspace.subscription?.status === "active") {',
  '}',
  '```',
  '',
  'Check the caller.',
].join('\n');

const ANSWER_WITH_NESTED_FENCE = [
  '1. Add a guard:',
  '',
  '   ```ts',
  '   if (!workspace.subscription) {',
  '     return;',
  '   }',
  '   ```',
  '',
  '2. Ship it.',
].join('\n');

const CHUNK_ACROSS_FENCE = 7;

describe('getMarkdownRenderer', () => {
  describe('literal characters', () => {
    it.each([
      ['an apostrophe in text', 'it doesn\'t run', 'it doesn\'t run'],
      ['ampersands in text', 'compare a && b', 'compare a && b'],
      ['an angle bracket in text', 'a < b', 'a < b'],
      ['an apostrophe in inline code', '`reading \'subscription\'`', 'reading \'subscription\''],
      ['a quote in inline code', '`x === "active"`', 'x === "active"'],
      ['an apostrophe in inline code inside a heading', '# `it doesn\'t run`', 'it doesn\'t run'],
      ['an apostrophe in inline code inside a blockquote', '> `it doesn\'t run`', 'it doesn\'t run'],
    ])('should show %s as written', (_case, source, expected) => {
      expect(render(source).textContent).toContain(expected);
    });
  });

  describe('block structure', () => {
    it.each([
      ['a list', '- one\n- two', 'ul li'],
      ['a table', '| a |\n|---|\n| b |', 'table td'],
      ['a heading with inline formatting', '# **bold** title', 'h1 strong'],
      ['a blockquote with inline formatting', '> **bold** text', 'blockquote strong'],
      ['an autolink', '<https://hawk.so>', 'a'],
    ])('should build %s', (_case, source, selector) => {
      expect(render(source).querySelector(selector)).not.toBeNull();
    });
  });

  describe('sanitising', () => {
    it.each([
      ['a remote image', '<img src="https://attacker.example/pixel.png">', 'img'],
      ['an image smuggled out of inline code', '`</code><img src=x>`', 'img'],
      ['an image smuggled out of inline code inside a heading', '# `</code><img src=x>`', 'img'],
      ['an image smuggled out of inline code inside a blockquote', '> `</code><img src=x>`', 'img'],
      ['an image written in markdown', '![pixel](https://attacker.example/pixel.png)', 'img'],
      ['a form', '<form action="https://attacker.example"></form>', 'form'],
      ['a stylesheet', '<style>body { display: none }</style>', 'style'],
    ])('should keep %s out of the DOM', (_case, source, selector) => {
      expect(render(source).querySelector(selector)).toBeNull();
    });

    it('should drop a javascript: link target', () => {
      const link = render('[click](javascript:alert(1))').querySelector('a');

      expect(link?.getAttribute('href')).toBeNull();
    });

    it('should keep an ordinary link target', () => {
      const link = render('[click](https://hawk.so)').querySelector('a');

      expect(link?.getAttribute('href')).toBe('https://hawk.so');
    });
  });

  describe('design system classes', () => {
    it.each([
      ['a paragraph', 'plain', 'p', 'text-p'],
      ['a top-level heading', '# title', 'h1', 'text-h1'],
      ['a second-level heading', '## title', 'h2', 'text-h2'],
      ['inline code', 'an `identifier` here', 'code', 'text-monospaced'],
      ['inline code inside a heading', '# an `identifier` here', 'h1 code', 'text-monospaced'],
      ['inline code inside a blockquote', '> an `identifier` here', 'blockquote code', 'text-monospaced'],
      ['a paragraph inside a blockquote', '> plain', 'blockquote p', 'text-p'],
    ])('should mark %s', (_case, source, selector, className) => {
      expect(render(source).querySelector(selector)?.className).toBe(className);
    });
  });
});

describe('getMarkdownStreamRenderer', () => {
  it('should render the same content however the source is chunked', async () => {
    const [whole, byCharacter] = await Promise.all([
      stream(ANSWER, ANSWER.length),
      stream(ANSWER, 1),
    ]);

    expect(content(byCharacter)).toBe(content(whole));
  });

  it('should render the same content when the fence sits inside a list', async () => {
    const [whole, byCharacter] = await Promise.all([
      stream(ANSWER_WITH_NESTED_FENCE, ANSWER_WITH_NESTED_FENCE.length),
      stream(ANSWER_WITH_NESTED_FENCE, 1),
    ]);

    expect(content(byCharacter)).toBe(content(whole));
  });

  it('should close a code block split across chunks', async () => {
    const code = (await stream(ANSWER, CHUNK_ACROSS_FENCE)).filter(node => node.type === 'code');

    expect(code).toMatchObject([{ lang: 'ts' }]);
  });

  it('should keep the key of a block that is still growing', async () => {
    const renderer = await getMarkdownStreamRenderer();
    const [first] = renderer.append('The subscription');
    const [grown] = renderer.append(' field is not set.');

    expect(grown.key).toBe(first.key);
  });
});

describe('splitStringIntoTextAndCodeSegments', () => {
  it('should read the language off a fence', () => {
    const [segment] = splitStringIntoTextAndCodeSegments('```ts\nconst x = 1;\n```');

    expect(segment).toMatchObject({ type: 'code',
      lang: 'ts' });
  });

  it('should fall back to plaintext for a fence without a language', () => {
    const [segment] = splitStringIntoTextAndCodeSegments('```\nconst x = 1;\n```');

    expect(segment).toMatchObject({ type: 'code',
      lang: 'plaintext' });
  });

  it('should leave an unclosed fence as text', () => {
    const [segment] = splitStringIntoTextAndCodeSegments('```ts\nconst x = 1;');

    expect(segment.type).toBe('text');
  });

  it('should leave a fence nested in a list as text', () => {
    const source = '1. Fix it:\n\n   ```ts\n   const x = 1;\n   ```\n';
    const segments = splitStringIntoTextAndCodeSegments(source);

    expect(segments.filter(segment => segment.type === 'code')).toHaveLength(0);
  });
});

describe('wrapWordsInHtml', () => {
  /**
   * Read the text a browser would show for a fragment of markup.
   * @param html - markup to read
   * @returns its text content
   */
  const textOf = (html: string): string => {
    const host = document.createElement('div');

    host.innerHTML = html;

    return host.textContent ?? '';
  };

  it('should put each word in a span of its own', () => {
    const words = ['one', 'two', 'three'];
    const html = wrapWordsInHtml(`<p>${words.join(' ')}</p>`);
    const host = document.createElement('div');

    host.innerHTML = html;

    expect(host.querySelectorAll('[data-stream-word]')).toHaveLength(words.length);
  });

  it('should leave the text exactly as it was', () => {
    const html = renderMarkdown(ANSWER);

    expect(textOf(wrapWordsInHtml(html))).toBe(textOf(html));
  });

  it('should keep the spacing between words', () => {
    expect(textOf(wrapWordsInHtml('<p>one  two\nthree</p>'))).toBe('one  two\nthree');
  });

  it('should leave code alone, where the split would land inside a token', () => {
    const html = wrapWordsInHtml('<p>call <code>new Map()</code> here</p>');
    const host = document.createElement('div');

    host.innerHTML = html;

    expect(host.querySelectorAll('code [data-stream-word]')).toHaveLength(0);
    expect(host.querySelector('code')?.textContent).toBe('new Map()');
  });

  it('should reach into the text of nested markup', () => {
    const html = wrapWordsInHtml('<ul><li><strong>bold</strong> word</li></ul>');
    const host = document.createElement('div');

    host.innerHTML = html;

    expect(host.querySelectorAll('strong [data-stream-word]')).toHaveLength(1);
    expect(host.querySelectorAll('[data-stream-word]')).toHaveLength(2);
  });

  it('should wrap the words of a streamed answer as it renders', async () => {
    const nodes = await stream(ANSWER, CHUNK_ACROSS_FENCE);
    const html = nodes.map(node => (node.type === 'text' ? node.html : '')).join('');

    expect(html).toContain('data-stream-word');
  });
});
