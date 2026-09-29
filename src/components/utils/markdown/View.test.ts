import { describe, expect, it } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import { marked } from 'marked';
import MarkdownView from './View.vue';
import MarkdownBlock from './Block.vue';

/**
 * Mount the view for a markdown source.
 * @param source - markdown text
 * @returns element the view is mounted into
 */
function render(source: string): HTMLElement {
  const host = document.createElement('div');
  const app = createApp({
    render: () => h(MarkdownView, { blocks: marked.lexer(source) }),
  });

  app.config.globalProperties.$t = (key: string) => key;
  app.directive('copyable', {});
  app.mount(host);

  return host;
}

describe('MarkdownView', () => {
  describe('text', () => {
    it.each([
      ['special characters as written', 'it doesn\'t run && a < b', 'it doesn\'t run && a < b'],
      ['inline code as written', '`x === "it\'s"`', 'x === "it\'s"'],
      ['an escaped character without backslash', 'not \\*bold\\*', 'not *bold*'],
      ['raw HTML as text', 'Press <kbd>Ctrl</kbd>', 'Press <kbd>Ctrl</kbd>'],
      ['named references decoded', 'a &amp; b &copy; c &hellip;', 'a & b © c …'],
      ['numeric references decoded', '&#39;a&#39; &#x3C;b&#x3E;', '\'a\' <b>'],
      ['an invalid code point as the replacement character', 'a &#0; b', 'a \uFFFD b'],
      ['an over-long numeric reference as written', 'a &#99999999; b', 'a &#99999999; b'],
      ['a reference in inline code as written', '`a &amp; b`', 'a &amp; b'],
      ['an unknown reference as written', 'a &foo; b', 'a &foo; b'],
      ['a reference decodable only in part as written', 'a &notit; b', 'a &notit; b'],
      ['a reference that decodes into what looks like another', 'a &amp;foo; b', 'a &foo; b'],
      ['a reference that decodes in front of an over-long one', 'a &amp;#99999999; b', 'a &#99999999; b'],
      ['a space between a task checkbox and its text', '- [x] done', ' done'],
    ])('should render %s', (_case, source, expected) => {
      expect(render(source).textContent).toContain(expected);
    });
  });

  describe('blocks', () => {
    it.each([
      ['a nested list', '- outer\n  - inner\n- next', 'ul li ul li'],
      ['an unclosed fence', '```ts\nconst a = 1;', '.markdown-view__code'],
      ['a list', '- one\n- two', 'ul li'],
      ['an ordered list from its start', '3. three\n4. four', 'ol[start="3"] li'],
      ['a task as a disabled checkbox', '- [x] done', 'li input[type="checkbox"][disabled]'],
      ['a task of a loose list as a disabled checkbox', '- [x] done\n\n- [ ] todo', 'li p input[type="checkbox"][disabled]'],
      ['a table', '| a |\n|---|\n| b |', 'table td'],
      ['formatting inside a heading', '# **bold** title', 'h1 strong'],
      ['formatting inside a blockquote', '> **bold** text', 'blockquote strong'],
      ['strikethrough', '~~old~~ new', 'del'],
      ['an autolink', '<https://hawk.so>', 'a'],
      ['a bare URL as a link', 'see https://hawk.so now', 'a'],
      ['a code block', '```ts\nconst a = 1;\n```', '.markdown-view__code'],
      ['a code block inside a list', '1. Fix:\n\n   ```ts\n   const a = 1;\n   ```', 'li .markdown-view__code'],
    ])('should render %s', (_case, source, selector) => {
      expect(render(source).querySelector(selector)).not.toBeNull();
    });

    it('should drop trailing blank lines of a code block', () => {
      const lines = render('```ts\na\n\n\n```').querySelectorAll('.code-preview__line-numbers span');

      expect(lines).toHaveLength(1);
    });
  });

  describe('links', () => {
    it.each([
      ['target', '[click](https://hawk.so/?a=1&amp;b=2)', 'href', 'https://hawk.so/?a=1&b=2'],
      ['title', '[click](https://hawk.so "a &amp; b")', 'title', 'a & b'],
    ])('should decode references in the link %s', (_case, source, attribute, value) => {
      const link = render(source).querySelector('a');

      expect(link?.getAttribute(attribute)).toBe(value);
    });
  });

  it('should keep an image description without loading the image', () => {
    const view = render('[![a &amp; b](https://images.example/badge)](https://hawk.so)');

    expect(view.querySelector('img')).toBeNull();
    expect(view.querySelector('a')?.textContent).toBe('a & b');
  });

  it('should retain the source of an unknown inline token', () => {
    const host = document.createElement('div');
    const app = createApp({
      render: () => h(MarkdownBlock, {
        block: { type: 'paragraph',
          raw: 'custom',
          tokens: [{ type: 'custom',
            raw: 'custom' }] },
      }),
    });

    app.mount(host);

    expect(host.textContent).toBe('custom');
    app.unmount();
  });

  it.each([
    ['without a language', '```\ntext\n```', 'plaintext'],
    ['with fence metadata', '```javascript title="app.js"\nconst a = 1;\n```', 'javascript'],
  ])('should select a code language %s', async (_case, source, language) => {
    const view = render(source);

    await nextTick();

    expect(view.querySelector('pre')?.classList.contains(language)).toBe(true);
  });

  it('should keep table alignment in header and body cells', () => {
    const view = render('| left | center | right |\n|:---|:---:|---:|\n| a | b | c |');

    expect(Array.from(view.querySelectorAll('th, td'), cell => (cell as HTMLElement).style.textAlign))
      .toEqual(['left', 'center', 'right', 'left', 'center', 'right']);
  });

  it('should open absolute links in another tab', () => {
    const link = render('[docs](https://hawk.so)').querySelector('a');

    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  describe('safety', () => {
    it.each([
      ['raw HTML', '<img src="https://attacker.example/pixel.png"><form></form><style>body { display: none }</style>'],
      ['a markdown image', '![pixel](https://attacker.example/pixel.png)'],
    ])('should not create elements from %s', (_case, source) => {
      expect(render(source).querySelector('img, form, style')).toBeNull();
    });

    it.each([
      ['an empty link target', '[click]()'],
      ['a relative link target', '[click](/project/x)'],
      ['a fragment link target', '[click](#)'],
      ['an unsafe link target', '[click](javascript:alert(1))'],
      ['an unsafe link target written with references', '[click](javascript&colon;alert(1))'],
    ])('should render the text of %s without a link', (_case, source) => {
      const view = render(source);

      expect(view.querySelector('a')).toBeNull();
      expect(view.textContent).toBe('click');
    });

    it('should keep a safe link target', () => {
      const link = render('[click](https://hawk.so)').querySelector('a');

      expect(link?.getAttribute('href')).toBe('https://hawk.so');
    });
  });
});
