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
    ['en', 'Occurred in', 'Introduced in', 'Potentially resolved in', 'Regressed in'],
    ['ru', 'Произошло в', 'Появилось в', 'Потенциально исправлено в', 'Регрессия в'],
  ])('preserves every %s lifecycle link and the selected repetition release', async (locale, releaseLabel, firstSeenLabel, resolvedLabel, regressionLabel) => {
    const releases = ['original/build#1', 'selected/build#2', 'fixed/build#3', 'again/build#4'];
    const router = await mount({
      release: releases[1],
      firstSeenInRelease: releases[0],
      resolvedInRelease: releases[2],
      regressionInRelease: releases[3],
    }, locale);

    expect(host.querySelector('.event-details__header')?.textContent?.trim())
      .toBe(locale === 'ru' ? 'Релиз' : 'Release');
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
      ['Introduced in', 'original'],
      ['Potentially resolved in', 'fixed'],
      ['Regressed in', 'again'],
    ]);
  });

  it('shows a regressed repetition once under the regression label', async () => {
    await mount({
      release: 'again',
      firstSeenInRelease: 'original',
      resolvedInRelease: 'fixed',
      regressionInRelease: 'again',
    }, 'ru');

    expect(rows()).toEqual([
      ['Появилось в', 'original'],
      ['Потенциально исправлено в', 'fixed'],
      ['Регрессия в', 'again'],
    ]);
  });

  it('does not call an ordinary repetition a regression', async () => {
    await mount({ release: 'repeated',
      firstSeenInRelease: 'original' });

    expect(rows()).toEqual([
      ['Introduced in', 'original'],
      ['Occurred in', 'repeated'],
    ]);
  });

  it.each([undefined, null, '', '   ', 'null', 'undefined', ' NULL ', 'NaN'])(
    'hides the entire section for non-meaningful releases: %j', async (release) => {
      await mount({ release,
        firstSeenInRelease: release,
        resolvedInRelease: release,
        regressionInRelease: release });
      expect(host.querySelector('.event-details')).toBeNull();
    }
  );

  it('only shows meaningful rows when release metadata is mixed', async () => {
    await mount({ release: 'undefined',
      firstSeenInRelease: 'null',
      resolvedInRelease: 'fixed',
      regressionInRelease: ' ' });
    expect(rows()).toEqual([['Potentially resolved in', 'fixed']]);
  });

  it('shows a legacy payload release without lifecycle data', async () => {
    await mount({ release: 'legacy/build#1' });

    expect(rows()).toEqual([['Occurred in', 'legacy/build#1']]);
    expect(host.querySelector('a')?.getAttribute('href')).toBe('/project/project-42/releases/legacy%2Fbuild%231');
  });

  it('shows lifecycle releases without a payload release', async () => {
    await mount({
      firstSeenInRelease: 'original',
      resolvedInRelease: 'fixed',
      regressionInRelease: 'again',
    });

    expect(rows()).toEqual([
      ['Introduced in', 'original'],
      ['Potentially resolved in', 'fixed'],
      ['Regressed in', 'again'],
    ]);
  });
});
