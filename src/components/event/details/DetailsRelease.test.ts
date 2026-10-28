import { afterEach, describe, expect, it } from 'vitest';
import { createApp, h, type App } from 'vue';
import { createI18n } from 'vue-i18n';
import { createMemoryHistory, createRouter, type Router } from 'vue-router';
import en from '../../../i18n/messages/en.json';
import ru from '../../../i18n/messages/ru.json';
import DetailsRelease from './DetailsRelease.vue';

type ReleaseProps = Partial<Record<'release' | 'firstSeenInRelease' | 'resolvedInRelease' | 'regressionInRelease', string | null>>;

let app: App | undefined;
let host: HTMLDivElement;

afterEach(() => {
  app?.unmount();
  host.remove();
});

/**
 * Use a memory router to check real link encoding without loading the app routes.
 * @param props - payload and lifecycle releases
 * @param locale - UI language
 * @returns router for resolving rendered links
 */
async function mount(props: ReleaseProps, locale = 'en'): Promise<Router> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/project/:projectId/events/:eventId',
        name: 'event',
        component: DetailsRelease },
      { path: '/project/:projectId/releases/:release',
        name: 'project-release',
        component: { render: () => null } },
    ],
  });

  await router.push('/project/project-42/events/event-1');
  await router.isReady();

  host = document.createElement('div');
  document.body.append(host);
  app = createApp({ render: () => h(DetailsRelease, props) });
  app.use(createI18n({ legacy: false,
    locale,
    messages: { en,
      ru } }));
  app.use(router);
  app.mount(host);

  return router;
}

/**
 * Read visible row labels and release values rather than component internals.
 * @returns rendered release rows
 */
function rows(): (string | undefined)[][] {
  return Array.from(host.querySelectorAll('.event-details__content-block'), row => [
    row.querySelector('.event-details__key')?.textContent?.trim(),
    row.querySelector('a')?.textContent?.trim(),
  ]);
}

describe('DetailsRelease', () => {
  it.each([
    ['en', 'Release', 'First seen in release', 'Resolved in release', 'Regressed in release'],
    ['ru', 'Релиз', 'Впервые в релизе', 'Исправлено в релизе', 'Регрессия в релизе'],
  ])('preserves every %s lifecycle link and the selected repetition release', async (locale, releaseLabel, firstSeenLabel, resolvedLabel, regressionLabel) => {
    const releases = ['original/build#1', 'selected/build#2', 'fixed/build#3', 'again/build#4'];
    const router = await mount({
      release: releases[1],
      firstSeenInRelease: releases[0],
      resolvedInRelease: releases[2],
      regressionInRelease: releases[3],
    }, locale);

    expect(rows()).toEqual([
      [firstSeenLabel, releases[0]],
      [releaseLabel, releases[1]],
      [resolvedLabel, releases[2]],
      [regressionLabel, releases[3]],
    ]);

    const links = host.querySelectorAll('a');

    expect(links).toHaveLength(releases.length);
    links.forEach((link, index) => {
      const release = releases[index];
      const href = link.getAttribute('href');

      expect(link.getAttribute('title')).toBe(release);
      expect(href).toBe(`/project/project-42/releases/${encodeURIComponent(release)}`);
      const target = router.resolve(href!);

      expect(target.name).toBe('project-release');
      expect(target.params).toEqual({ projectId: 'project-42',
        release });
      expect(target.hash).toBe('');
    });
  });

  it('does not duplicate the payload release when it is the first-seen release', async () => {
    await mount({
      release: 'original',
      firstSeenInRelease: 'original',
      resolvedInRelease: 'fixed',
      regressionInRelease: 'again',
    });

    expect(rows()).toEqual([
      ['First seen in release', 'original'],
      ['Resolved in release', 'fixed'],
      ['Regressed in release', 'again'],
    ]);
  });

  it('shows a legacy payload release without lifecycle data', async () => {
    await mount({ release: 'legacy/build#1' });

    expect(rows()).toEqual([['Release', 'legacy/build#1']]);
    expect(host.querySelector('a')?.getAttribute('href')).toBe('/project/project-42/releases/legacy%2Fbuild%231');
  });

  it('shows lifecycle releases without a payload release', async () => {
    await mount({
      firstSeenInRelease: 'original',
      resolvedInRelease: 'fixed',
      regressionInRelease: 'again',
    });

    expect(rows()).toEqual([
      ['First seen in release', 'original'],
      ['Resolved in release', 'fixed'],
      ['Regressed in release', 'again'],
    ]);
  });
});
