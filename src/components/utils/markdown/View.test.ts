import { describe, expect, it } from 'vitest';
import { createApp, h, nextTick, shallowRef, type ShallowRef } from 'vue';
import { marked, type Token } from 'marked';
import MarkdownView from './View.vue';

/**
 * Mounted view with blocks that can be replaced later.
 */
interface MountedView {
  host: HTMLElement;
  blocks: ShallowRef<Token[]>;
}

/**
 * Mount the view.
 * @param initial - blocks to render first
 * @returns host element and blocks to replace
 */
function mount(initial: Token[] = []): MountedView {
  const host = document.createElement('div');
  const blocks = shallowRef(initial);
  const app = createApp({
    render: () => h(MarkdownView, { blocks: blocks.value }),
  });

  app.config.globalProperties.$t = (key: string) => key;
  app.directive('copyable', {});
  app.mount(host);

  return {
    host,
    blocks,
  };
}

/**
 * Mount the view for a markdown source.
 * @param source - markdown text
 * @returns element the view is mounted into
 */
function render(source: string): HTMLElement {
  return mount(marked.lexer(source)).host;
}

describe('MarkdownView', () => {
  describe('text', () => {
    it.each([
      ['special characters as written', 'it doesn\'t run && a < b', 'it doesn\'t run && a < b'],
      ['inline code as written', '`x === "it\'s"`', 'x === "it\'s"'],
      ['an escaped character without backslash', 'not \\*bold\\*', 'not *bold*'],
      ['raw HTML as text', 'Press <kbd>Ctrl</kbd>', 'Press <kbd>Ctrl</kbd>'],
      ['a named reference decoded', 'a &amp; b', 'a & b'],
      ['numeric references decoded', '&#39;a&#39; &#x3C;b&#x3E;', '\'a\' <b>'],
      ['a reference in inline code as written', '`a &amp; b`', 'a &amp; b'],
      ['an unknown reference as written', 'a &copy; b', 'a &copy; b'],
      ['a reference named after an object property as written', 'a &constructor; b', 'a &constructor; b'],
    ])('should render %s', (_case, source, expected) => {
      expect(render(source).textContent).toContain(expected);
    });
  });

  describe('blocks', () => {
    it.each([
      ['a list', '- one\n- two', 'ul li'],
      ['an ordered list from its start', '3. three\n4. four', 'ol[start="3"] li'],
      ['a task as a disabled checkbox', '- [x] done', 'li input[type="checkbox"][disabled]'],
      ['a table', '| a |\n|---|\n| b |', 'table td'],
      ['formatting inside a heading', '# **bold** title', 'h1 strong'],
      ['formatting inside a blockquote', '> **bold** text', 'blockquote strong'],
      ['strikethrough', '~~old~~ new', 'del'],
      ['an autolink', '<https://hawk.so>', 'a'],
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

  describe('safety', () => {
    it.each([
      ['raw HTML', '<img src="https://attacker.example/pixel.png"><form></form><style>body { display: none }</style>'],
      ['a markdown image', '![pixel](https://attacker.example/pixel.png)'],
    ])('should not create elements from %s', (_case, source) => {
      expect(render(source).querySelector('img, form, style')).toBeNull();
    });

    it.each([
      ['drop an unsafe link target', '[click](javascript:alert(1))', null],
      ['keep a safe link target', '[click](https://hawk.so)', 'https://hawk.so'],
    ])('should %s', (_case, source, href) => {
      const link = render(source).querySelector('a');

      expect(link?.getAttribute('href')).toBe(href);
    });
  });

  describe('link definitions', () => {
    it('should link a reference once its definition arrives', async () => {
      const { host, blocks } = mount(marked.lexer('Read [docs] carefully.\n\n'));

      blocks.value = marked.lexer('Read [docs] carefully.\n\n[docs]: https://hawk.so/docs\n');
      await nextTick();

      expect(host.querySelector('a')?.getAttribute('href')).toBe('https://hawk.so/docs');
    });
  });
});
