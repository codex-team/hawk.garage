import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick, type App, type Component } from 'vue';
import type { AiSuggestionStreamOptions } from '@/api/ai';
import Dialog from './AiSuggestionDialog.vue';

const { stream, loadView } = vi.hoisted(() => ({ stream: vi.fn(),
  loadView: vi.fn() }));

vi.mock('@/api/ai', () => ({ streamEventAiSuggestion: stream }));
vi.mock('@/utils/loadAsyncComponent', async (importOriginal) => {
  const original = await importOriginal<{ loadAsyncComponent: <T extends Component>(loader: () => Promise<{ default: T }>) => () => Promise<{ default: T }> }>();

  return {
    ...original,
    loadAsyncComponent: (loader: () => Promise<{ default: Component }>) => original.loadAsyncComponent(async () => {
      await loadView();

      return loader();
    }),
  };
});
let app: App;
let options: AiSuggestionStreamOptions | undefined;
let resolveStream: () => void;
let rejectStream: (error: Error) => void;

/**
 * Open the dialog and wait until it starts reading the stream.
 * @returns dialog host
 */
async function mount(): Promise<HTMLElement> {
  await import('../utils/markdown/View.vue');

  const host = document.createElement('div');

  app = createApp({ render: () => h(Dialog, { projectId: 'p',
    eventId: 'e',
    originalEventId: 'o' }) });
  app.config.globalProperties.$t = (key: string) => key;
  app.mount(host);
  await vi.waitFor(() => expect(options).toBeDefined());
  await vi.waitFor(() => expect(host.querySelector('.popup-dialog-animation-enter-active')).toBeNull());
  vi.useFakeTimers();

  return host;
}

beforeEach(() => {
  options = undefined;
  loadView.mockResolvedValue(undefined);
  stream.mockImplementation((_project, _event, _original, callbacks) => {
    options = callbacks;

    return new Promise<void>((resolve, reject) => {
      resolveStream = resolve;
      rejectStream = reject;
    });
  });
});

afterEach(() => {
  app?.unmount();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('AiSuggestionDialog streaming', () => {
  it('should batch deltas until the next animation frame', async () => {
    const host = await mount();

    options!.onTextDelta('First ');
    options!.onTextDelta('second.');
    expect(host.querySelector('.ai-suggestion-skeleton')).not.toBeNull();
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersToNextFrame();
    await nextTick();
    await nextTick();

    await vi.advanceTimersByTimeAsync(0);
    expect(host.querySelector('.markdown-view p')?.textContent).toBe('First second.');
  });

  it('should publish the final delta without waiting for another frame', async () => {
    const host = await mount();

    options!.onTextDelta('Answer.');
    resolveStream();
    await nextTick();
    await nextTick();

    await vi.advanceTimersByTimeAsync(0);
    expect(host.querySelector('.markdown-view p')?.textContent).toBe('Answer.');
    expect(host.querySelector('.ai-suggestion-dialog__error')).toBeNull();
  });

  it('should discard a queued frame if the answer is refused', async () => {
    const host = await mount();

    options!.onTextDelta('Withdrawn ');
    options!.onError('Answer refused');
    resolveStream();
    await vi.runAllTimersAsync();
    await nextTick();

    expect(host.querySelector('.ai-suggestion-dialog__error')?.textContent).toBe('Answer refused');
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('AiSuggestionDialog loading', () => {
  it('should start the stream while the renderer loads and keep the skeleton visible', async () => {
    let finishLoading!: () => void;

    loadView.mockReturnValue(new Promise<void>((resolve) => {
      finishLoading = resolve;
    }));
    const host = await mount();

    expect(stream).toHaveBeenCalled();
    options!.onTextDelta('Answer.');
    resolveStream();
    await vi.advanceTimersByTimeAsync(0);
    expect(host.querySelector('.ai-suggestion-skeleton')).not.toBeNull();

    finishLoading();
    await vi.waitFor(() => expect(host.querySelector('.markdown-view p')?.textContent).toBe('Answer.'));
  });

  it('should show an error and abort the stream if the renderer fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadView.mockRejectedValue(new Error('Renderer unavailable'));
    const host = await mount();

    await vi.waitFor(() => expect(host.querySelector('.ai-suggestion-dialog__error')?.textContent).toBe('event.ai.error'));
    expect(options!.signal.aborted).toBe(true);
  });

  it('should show an error if the API request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const host = await mount();

    rejectStream(new Error('Offline'));
    await vi.waitFor(() => expect(host.querySelector('.ai-suggestion-dialog__error')?.textContent).toBe('event.ai.error'));
  });
});
