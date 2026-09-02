import { beforeAll, describe, expect, it } from 'vitest';
import { getMarkdownRenderer, splitStringIntoTextAndCodeSegments } from './markdown';

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

describe('getMarkdownRenderer', () => {
  describe('literal characters', () => {
    it.each([
      ['an apostrophe in text', 'it doesn\'t run', 'it doesn\'t run'],
      ['ampersands in text', 'compare a && b', 'compare a && b'],
      ['an angle bracket in text', 'a < b', 'a < b'],
      ['an apostrophe in inline code', '`reading \'subscription\'`', 'reading \'subscription\''],
      ['a quote in inline code', '`x === "active"`', 'x === "active"'],
    ])('should show %s as written', (_case, source, expected) => {
      expect(render(source).textContent).toContain(expected);
    });
  });

  describe('block structure', () => {
    it.each([
      ['a list', '- one\n- two', 'ul li'],
      ['a table', '| a |\n|---|\n| b |', 'table td'],
    ])('should build %s', (_case, source, selector) => {
      expect(render(source).querySelector(selector)).not.toBeNull();
    });
  });

  describe('sanitising', () => {
    it.each([
      ['a remote image', '<img src="https://attacker.example/pixel.png">', 'img'],
      ['an image smuggled out of inline code', '`</code><img src=x>`', 'img'],
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
      ['a blockquote', '> quoted', 'blockquote', 'text-blockquote'],
      ['a paragraph inside a blockquote', '> quoted', 'blockquote p', 'text-p'],
    ])('should mark %s', (_case, source, selector, className) => {
      expect(render(source).querySelector(selector)?.className).toBe(className);
    });
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
});
