import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, ref } from 'vue';
import CodeFragment from './CodeFragment.vue';

/**
 * Mounted code fragment with props that can be changed later.
 */
interface MountedFragment {
  host: HTMLElement;
  setCode: (code: string) => void;
  setLang: (lang: string) => void;
}

/**
 * Mount a code fragment.
 * @param code - initial code
 * @param lang - initial language
 * @param filename - file the code is taken from
 * @returns host element and prop setters
 */
function mount(code: string, lang: string, filename?: string): MountedFragment {
  const host = document.createElement('div');
  const source = ref(code);
  const language = ref(lang);
  const app = createApp({
    render: () => h(CodeFragment, {
      lines: source.value.split('\n').map((content, index) => ({
        line: index + 1,
        content,
      })),
      lang: language.value,
      filename,
    }),
  });

  app.config.globalProperties.$t = (key: string) => key;
  app.directive('copyable', {});
  app.mount(host);

  return {
    host,
    setCode: (next) => {
      source.value = next;
    },
    setLang: (next) => {
      language.value = next;
    },
  };
}

/**
 * Wait for render and highlighting.
 * @returns promise resolved after both
 */
function waitForHighlight(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve));
}

/**
 * Count highlighted keywords.
 * @param host - element the fragment is mounted into
 * @returns number of keyword elements
 */
function keywords(host: HTMLElement): number {
  return host.querySelectorAll('pre .hljs-keyword').length;
}

describe('CodeFragment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should highlight code on mount', async () => {
    const { host } = mount('const a = 1;', 'typescript');

    await waitForHighlight();

    expect(keywords(host)).toBe(1);
  });

  it('should highlight code added after mount', async () => {
    const { host, setCode } = mount('const a = 1;', 'typescript');

    await waitForHighlight();
    setCode('const a = 1;\nconst b = 2;');
    await waitForHighlight();

    expect(keywords(host)).toBe(2);
  });

  it('should highlight code once its language arrives', async () => {
    const { host, setLang } = mount('const a = 1;', 'plaintext');

    await waitForHighlight();
    setLang('typescript');
    await waitForHighlight();

    expect(keywords(host)).toBe(1);
  });

  it('should highlight once when code and language arrive together', async () => {
    const warn = vi.spyOn(console, 'warn');
    const { host, setCode, setLang } = mount('', 'plaintext');

    await waitForHighlight();
    setLang('typescript');
    setCode('const a = 1;');
    await waitForHighlight();

    expect(keywords(host)).toBe(1);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should keep the given language when code arrives with markup in a string', async () => {
    const { host, setCode } = mount('const list = document.body;', 'javascript');

    await waitForHighlight();
    setCode('const list = document.body;\nlist.innerHTML = \'<p>Cart is empty</p>\';');
    await waitForHighlight();

    expect(host.querySelector('pre .hljs-string')?.textContent).toBe('\'<p>Cart is empty</p>\'');
  });

  it('should highlight a file with a script inlined into markup as html', async () => {
    const { host } = mount('<button onclick="checkout()">Pay</button>', 'javascript', 'https://shop.example.com/cart');

    await waitForHighlight();

    expect(host.querySelector('pre .hljs-tag')).not.toBeNull();
  });

  it('should keep plaintext as text', async () => {
    const { host } = mount('const a = 1;', 'plaintext');

    await waitForHighlight();

    expect(keywords(host)).toBe(0);
    expect(host.querySelector('pre')?.textContent).toBe('const a = 1;');
  });
});
