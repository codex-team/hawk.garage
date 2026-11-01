import { afterEach, describe, expect, it } from 'vitest';
import { createApp, h, nextTick, reactive, type App } from 'vue';
import { createI18n } from 'vue-i18n';
import en from '../../i18n/messages/en.json';
import ru from '../../i18n/messages/ru.json';
import type { HawkEvent } from '../../types/events';
import EventReleaseStatus from './EventReleaseStatus.vue';

type ReleaseState = Pick<HawkEvent, 'firstSeenInRelease' | 'resolvedInRelease' | 'regressionInRelease' | 'isNew'>;

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

  it.each([undefined, null, '', '   ', 'null', 'undefined', ' NULL ', ' Undefined ', 'NaN'])(
    'hides non-meaningful release values: %j', (release) => {
      expect(mount({ firstSeenInRelease: release,
        resolvedInRelease: release,
        regressionInRelease: release,
        isNew: true }).querySelector('.event-release-status')).toBeNull();
    }
  );

  it('falls back to valid metadata when higher-priority fields are placeholders', () => {
    mount({ firstSeenInRelease: 'original',
      resolvedInRelease: 'fixed',
      regressionInRelease: 'null' });
    expect(host.textContent?.trim()).toBe('Resolved');
  });

  it.each([
    ['en', 'firstSeen', { firstSeenInRelease: 'build/start#1' }, 'New',
      'The event first appeared in release build/start#1, the project\'s latest release.'],
    ['ru', 'firstSeen', { firstSeenInRelease: 'build/start#1' }, 'Новое',
      'Событие впервые появилось в релизе build/start#1. Это последний релиз проекта.'],
    ['en', 'resolved', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'a-fixed' }, 'Resolved',
    'No occurrences observed starting with release a-fixed. This is an automatic estimate: the event may be fixed.'],
    ['ru', 'resolved', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'a-fixed' }, 'Исправлено',
    'Не наблюдалось начиная с релиза a-fixed. Это автоматическая оценка: событие потенциально исправлено.'],
    ['en', 'regression', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a/again#2' }, 'Regression',
    'The event reappeared in release a/again#2 after it was considered fixed.'],
    ['ru', 'regression', { firstSeenInRelease: 'z-original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a/again#2' }, 'Регрессия',
    'Событие вернулось в релизе a/again#2 после предполагаемого исправления.'],
  ] as const)('renders %s %s with the server flag and lifecycle priority', (locale, status, event, label, tooltip) => {
    const badge = mount({ ...event,
      isNew: true }, locale).querySelector('.event-release-status');

    expect(badge?.textContent?.trim()).toBe(label);
    expect(badge?.getAttribute('title')).toBe(tooltip);
    expect(badge?.classList.contains(`event-release-status--${status}`)).toBe(true);
    expect(host.querySelectorAll('.event-release-status')).toHaveLength(1);
    for (const release of Object.values(event)) {
      expect(badge?.textContent).not.toContain(release);
    }
  });

  it.each([undefined, false])(
    'hides the new badge when isNew is unavailable or false: %j', (isNew) => {
      mount({ firstSeenInRelease: 'original',
        isNew });
      expect(host.querySelector('.event-release-status')).toBeNull();
    }
  );

  it('removes the new badge when the server flag changes', async () => {
    const event = reactive<ReleaseState>({ firstSeenInRelease: 'current',
      isNew: true });

    mount(event);
    expect(host.textContent?.trim()).toBe('New');

    event.isNew = false;
    await nextTick();
    expect(host.querySelector('.event-release-status')).toBeNull();
  });

  it('returns to resolved when a regression is cleared reactively', async () => {
    const event = reactive<ReleaseState>({
      firstSeenInRelease: 'original',
      resolvedInRelease: 'z-fixed',
      regressionInRelease: 'a-regression',
    });

    mount(event);
    expect(host.textContent?.trim()).toBe('Regression');

    event.regressionInRelease = null;
    await nextTick();

    const badge = host.querySelector('.event-release-status');

    expect(badge?.textContent?.trim()).toBe('Resolved');
    expect(badge?.getAttribute('title')).toBe(
      'No occurrences observed starting with release z-fixed. This is an automatic estimate: the event may be fixed.'
    );
    expect(badge?.classList.contains('event-release-status--resolved')).toBe(true);
    expect(badge?.classList.contains('event-release-status--regression')).toBe(false);
  });
});
