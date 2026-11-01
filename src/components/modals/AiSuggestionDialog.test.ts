import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick, type App, type Component } from 'vue';

const { fetchSuggestion, loadView } = vi.hoisted(() => ({
  fetchSuggestion: vi.fn(),
  loadView: vi.fn(),
}));

vi.mock('@/api/events', () => ({ fetchEventAiSuggestion: fetchSuggestion }));
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

/**
 * Open the dialog with its real asynchronous renderer.
 * @returns dialog host
 */
async function mount(): Promise<HTMLElement> {
  const { default: Dialog } = await import('./AiSuggestionDialog.vue');
  const host = document.createElement('div');

  app = createApp({ render: () => h(Dialog, { projectId: 'p',
    eventId: 'e',
    originalEventId: 'o' }) });
  app.config.globalProperties.$t = (key: string) => key;
  app.mount(host);

  return host;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  loadView.mockResolvedValue(undefined);
  fetchSuggestion.mockResolvedValue('Answer.');
});

afterEach(() => {
  app?.unmount();
  vi.restoreAllMocks();
});

describe('AiSuggestionDialog loading', () => {
  it('should fetch the answer while the renderer is loading and keep the skeleton visible', async () => {
    let finishLoading!: () => void;

    loadView.mockReturnValue(new Promise<void>((resolve) => {
      finishLoading = resolve;
    }));
    const host = await mount();

    await vi.waitFor(() => expect(loadView).toHaveBeenCalled());
    expect(fetchSuggestion).toHaveBeenCalledWith('p', 'e', 'o');
    await nextTick();
    expect(host.querySelector('.ai-suggestion-skeleton')).not.toBeNull();

    finishLoading();
    await vi.waitFor(() => expect(host.querySelector('p')?.textContent).toBe('Answer.'));
    expect(host.querySelector('.ai-suggestion-skeleton')).toBeNull();
  });

  it('should show an error if the renderer cannot be loaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadView.mockRejectedValue(new Error('Renderer unavailable'));
    const host = await mount();

    await vi.waitFor(() => expect(host.querySelector('.ai-suggestion-dialog__error')?.textContent).toBe('event.ai.error'));
    expect(host.querySelector('.ai-suggestion-skeleton')).toBeNull();
  });

  it('should show an error if the API request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchSuggestion.mockRejectedValue(new Error('Offline'));
    const host = await mount();

    await vi.waitFor(() => expect(host.querySelector('.ai-suggestion-dialog__error')?.textContent).toBe('event.ai.error'));
  });
});
