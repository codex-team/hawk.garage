import { describe, expect, it } from 'vitest';
import { createApp, h, nextTick, shallowRef } from 'vue';
import { type Token } from 'marked';
import MarkdownView from './View.vue';
import { createIncrementalLexer } from '@/utils/markdown';

/**
 * Paragraphs between a reference and its definition, enough for the reference to settle first.
 */
const PARAGRAPHS_BEFORE_DEFINITION = 5;

/**
 * View of an answer that is still being streamed.
 */
interface StreamedView {
  /**
   * Element the view is mounted into.
   */
  host: HTMLElement;

  /**
   * Append text character by character, rendering every state it passes through.
   */
  stream(text: string): Promise<void>;

  /**
   * Render the answer lexed again, as the dialog does once the stream ends.
   */
  end(): Promise<void>;
}

/**
 * Mount the view over a lexer of a streamed answer.
 * @returns mounted view to stream text into
 */
async function streamed(): Promise<StreamedView> {
  const host = document.createElement('div');
  const blocks = shallowRef<Token[]>([]);
  const lexer = await createIncrementalLexer();
  const app = createApp({
    render: () => h(MarkdownView, { blocks: blocks.value }),
  });

  app.config.globalProperties.$t = (key: string) => key;
  app.directive('copyable', {});
  app.mount(host);

  return {
    host,

    /**
     * Feed one character at a time, rendering after each. The dialog releases whole words, but a
     * character is the smallest step the lexer takes, so this walks the view through every
     * intermediate state a word-sized step would skip over.
     * @param text - fragment of the answer to append
     */
    async stream(text: string): Promise<void> {
      for (const character of text) {
        blocks.value = lexer.append(character);
        await nextTick();
      }
    },

    async end(): Promise<void> {
      blocks.value = lexer.reparse();
      await nextTick();
    },
  };
}

describe('MarkdownView', () => {
  describe('streaming', () => {
    it('should render a block while the next one is still arriving', async () => {
      const view = await streamed();

      await view.stream('## Cause\n\nThe guard reads ');

      expect(view.host.querySelector('h2')?.textContent).toBe('Cause');
    });

    it('should grow the last paragraph in place', async () => {
      const view = await streamed();

      await view.stream('The guard reads ');

      const paragraph = view.host.querySelector('p');

      await view.stream('undefined.\n');

      expect(view.host.querySelector('p')).toBe(paragraph);
      expect(paragraph?.textContent).toBe('The guard reads undefined.');
    });

    it('should render a fence that has not closed yet', async () => {
      const view = await streamed();

      await view.stream('```ts\nconst a = 1;\n');

      expect(view.host.querySelector('.markdown-view__code')?.textContent).toContain('const a = 1;');
    });

    it('should link a reference its definition follows closely', async () => {
      const view = await streamed();

      await view.stream('Read [docs] carefully.\n\n[docs]: https://hawk.so/docs\n');

      expect(view.host.querySelector('a')?.getAttribute('href')).toBe('https://hawk.so/docs');
    });

    it('should link a settled reference once the answer is lexed again', async () => {
      const paragraphs = 'Another paragraph of the answer.\n\n'.repeat(PARAGRAPHS_BEFORE_DEFINITION);
      const view = await streamed();

      await view.stream(`Read [docs] carefully.\n\n${paragraphs}[docs]: https://hawk.so/docs\n`);

      expect(view.host.querySelector('a')).toBeNull();

      await view.end();

      expect(view.host.querySelector('a')?.getAttribute('href')).toBe('https://hawk.so/docs');
    });
  });
});
