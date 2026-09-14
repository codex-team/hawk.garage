import { describe, expect, it } from 'vitest';
import { createApp, h, nextTick, shallowRef } from 'vue';
import { marked, type Token } from 'marked';
import MarkdownView from './View.vue';

/**
 * View of an answer that is still being streamed.
 */
interface StreamedView {
  /**
   * Element the view is mounted into.
   */
  host: HTMLElement;

  /**
   * Append a fragment and render the answer as it reads so far.
   */
  stream(text: string): Promise<void>;
}

/**
 * Mount the view over an answer that arrives in fragments.
 * @returns mounted view to stream text into
 */
function streamed(): StreamedView {
  const host = document.createElement('div');
  const blocks = shallowRef<Token[]>([]);
  const app = createApp({
    render: () => h(MarkdownView, { blocks: blocks.value }),
  });
  let source = '';

  app.config.globalProperties.$t = (key: string) => key;
  app.directive('copyable', {});
  app.mount(host);

  return {
    host,

    async stream(text: string): Promise<void> {
      source += text;
      blocks.value = marked.lexer(source);

      await nextTick();
    },
  };
}

describe('MarkdownView', () => {
  describe('streaming', () => {
    it('should render a block while the next one is still arriving', async () => {
      const view = streamed();

      await view.stream('## Cause\n\nThe guard reads ');

      expect(view.host.querySelector('h2')?.textContent).toBe('Cause');
    });

    it('should grow the last paragraph in place', async () => {
      const view = streamed();

      await view.stream('The guard reads ');

      const paragraph = view.host.querySelector('p');

      await view.stream('undefined.\n');

      expect(view.host.querySelector('p')).toBe(paragraph);
      expect(paragraph?.textContent).toBe('The guard reads undefined.');
    });

    it('should render a fence that has not closed yet', async () => {
      const view = streamed();

      await view.stream('```ts\nconst a = 1;\n');

      expect(view.host.querySelector('.markdown-view__code')?.textContent).toContain('const a = 1;');
    });

    it('should link a reference once its definition arrives', async () => {
      const view = streamed();

      await view.stream('Read [docs] carefully.\n\n');

      expect(view.host.querySelector('a')).toBeNull();

      await view.stream('[docs]: https://hawk.so/docs\n');

      expect(view.host.querySelector('a')?.getAttribute('href')).toBe('https://hawk.so/docs');
    });
  });
});
