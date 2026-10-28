import { afterEach, describe, expect, it } from 'vitest';
import { createApp, h, nextTick, reactive, type App } from 'vue';
import { createI18n } from 'vue-i18n';
import en from '../../i18n/messages/en.json';
import ru from '../../i18n/messages/ru.json';
import type { HawkEvent } from '../../types/events';
import EventReleaseStatus from './EventReleaseStatus.vue';

type ReleaseState = Pick<HawkEvent, 'firstSeenInRelease' | 'resolvedInRelease' | 'regressionInRelease'>;

let app: App | undefined;
let host: HTMLDivElement;

afterEach(() => {
  app?.unmount();
  host.remove();
});

/**
 * Mount the badge with the real translations and reactive event state.
 * @param event - lifecycle fields from the event
 * @param locale - UI language
 * @returns badge container
 */
function mount(event: ReleaseState, locale = 'en'): HTMLDivElement {
  host = document.createElement('div');
  document.body.append(host);
  app = createApp({ render: () => h(EventReleaseStatus, { event }) });
  app.use(createI18n({ legacy: false,
    locale,
    messages: { en,
      ru } }));
  app.mount(host);

  return host;
}

describe('EventReleaseStatus', () => {
  it.each([
    {},
    { firstSeenInRelease: null,
      resolvedInRelease: null,
      regressionInRelease: null },
  ])('hides the badge without lifecycle data: %j', (event) => {
    expect(mount(event).querySelector('.event-release-status')).toBeNull();
    expect(host.textContent).toBe('');
  });

  it.each([
    ['en', 'firstSeen', { firstSeenInRelease: 'build/start#1' }, 'First seen in build/start#1'],
    ['ru', 'firstSeen', { firstSeenInRelease: 'build/start#1' }, 'Впервые в build/start#1'],
    ['en', 'resolved', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'a-fixed' }, 'Resolved in a-fixed'],
    ['ru', 'resolved', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'a-fixed' }, 'Исправлено в a-fixed'],
    ['en', 'regression', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a/again#2' }, 'Regression in a/again#2'],
    ['ru', 'regression', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a/again#2' }, 'Регрессия в a/again#2'],
  ] as const)('renders %s %s with lifecycle precedence, not release sorting', (locale, status, event, label) => {
    const badge = mount(event, locale).querySelector('.event-release-status');

    expect(badge?.textContent?.trim()).toBe(label);
    expect(badge?.getAttribute('title')).toBe(label);
    expect(badge?.classList.contains(`event-release-status--${status}`)).toBe(true);
    expect(host.querySelectorAll('.event-release-status')).toHaveLength(1);
  });

  it('returns to resolved when a regression is cleared reactively', async () => {
    const event = reactive<ReleaseState>({
      firstSeenInRelease: 'original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a-regression',
    });

    mount(event);
    expect(host.textContent?.trim()).toBe('Regression in a-regression');

    event.regressionInRelease = null;
    await nextTick();

    const badge = host.querySelector('.event-release-status');

    expect(badge?.textContent?.trim()).toBe('Resolved in z-fixed');
    expect(badge?.getAttribute('title')).toBe('Resolved in z-fixed');
    expect(badge?.classList.contains('event-release-status--resolved')).toBe(true);
    expect(badge?.classList.contains('event-release-status--regression')).toBe(false);
  });
});
