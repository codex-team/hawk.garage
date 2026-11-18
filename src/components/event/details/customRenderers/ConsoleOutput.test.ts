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

  it('renders an empty message when the event has no message', () => {
    host = document.createElement('div');
    document.body.append(host);
    app = createApp({
      render: () => h(ConsoleOutput, {
        value: [{
          method: 'error',
          timestamp: '2026-11-17T09:58:23.289Z',
        }],
      }),
    });

    expect(() => app?.mount(host)).not.toThrow();
    expect(host.querySelector('.log-message')?.textContent).toBe('ERROR ');
  });

  it('renders styled messages with malformed style values safely', () => {
    host = document.createElement('div');
    document.body.append(host);
    app = createApp({
      render: () => h(ConsoleOutput, {
        value: [{
          method: 'log',
          timestamp: '2026-11-17T09:58:23.289Z',
          message: 'Styled%c message',
          styles: ['font-weight'],
        }],
      }),
    });

    expect(() => app?.mount(host)).not.toThrow();
    expect(host.querySelector('.log-message')?.textContent).toBe('Styled message ');
  });

  it.each([
    ['warn', 'WARN A warning message'],
    ['log', 'A regular log message'],
  ])('preserves formatting for console.%s messages', (method, expectedMessage) => {
    host = document.createElement('div');
    document.body.append(host);
    app = createApp({
      render: () => h(ConsoleOutput, {
        value: [{
          method,
          timestamp: '2026-11-17T09:58:23.289Z',
          message: method === 'warn' ? 'A warning message' : 'A regular log message',
        }],
      }),
    });

    app.mount(host);

    expect(host.querySelector('.log-message')?.textContent).toBe(expectedMessage);
  });
});
