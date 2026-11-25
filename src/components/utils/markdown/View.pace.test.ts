import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, shallowRef, type App } from 'vue';
import { marked, type Token } from 'marked';
import MarkdownView from './View.vue';
import { createStreamPacer, type StreamPacer } from '@/utils/streamPacer';

/** More words than a second of pacing can display. */
const BACKLOG_WORDS = 100;

let app: App;
let pacer: StreamPacer;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  pacer?.stop();
  app?.unmount();
  vi.useRealTimers();
});

/**
 * Render paced text through the same block view used by the dialog.
 * @param text - answer arriving in one burst
 * @returns the element displaying released words
 */
function renderBurst(text: string): HTMLElement {
  const host = document.createElement('div');
  const blocks = shallowRef<Token[]>([]);
  let source = '';

  app = createApp({ render: () => h(MarkdownView, { blocks: blocks.value }) });
  app.mount(host);
  pacer = createStreamPacer({
    onText: (delta) => {
      source += delta;
      blocks.value = marked.lexer(source);
    },
  });
  pacer.push(text);

  return host;
}

describe('MarkdownView pacing', () => {
  it('should reveal a heading word by word even with a large backlog', async () => {
    const host = renderBurst('## Short summary\n\n' + 'body '.repeat(BACKLOG_WORDS));

    await vi.advanceTimersToNextTimerAsync();
    await vi.advanceTimersToNextTimerAsync();

    expect(host.querySelector('h2')?.textContent).toBe('Short');

    await vi.advanceTimersToNextTimerAsync();

    expect(host.querySelector('h2')?.textContent).toBe('Short summary');
  });

  it('should reveal a quotation word by word even with a large backlog', async () => {
    const host = renderBurst('> These words arrive gradually.\n\n' + 'body '.repeat(BACKLOG_WORDS));

    await vi.advanceTimersToNextTimerAsync();
    await vi.advanceTimersToNextTimerAsync();

    expect(host.querySelector('blockquote')?.textContent).toBe('These ');

    await vi.advanceTimersToNextTimerAsync();

    expect(host.querySelector('blockquote')?.textContent).toBe('These words ');
  });
});
