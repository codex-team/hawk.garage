import { afterEach, describe, expect, it } from 'vitest';
import { createApp, h, type App } from 'vue';
import ConsoleOutput from './ConsoleOutput.vue';

let app: App | undefined;
let host: HTMLDivElement;

afterEach(() => {
  app?.unmount();
  host.remove();
});

describe('ConsoleOutput', () => {
  it('renders log messages when the method and type are missing', () => {
    host = document.createElement('div');
    document.body.append(host);
    app = createApp({
      render: () => h(ConsoleOutput, {
        value: [{
          timestamp: '2026-11-17T09:58:23.289Z',
          message: 'A console error without method metadata',
        }],
      }),
    });

    expect(() => app?.mount(host)).not.toThrow();
    expect(host.querySelector('.log-message')?.textContent)
      .toBe('A console error without method metadata');
  });
});
