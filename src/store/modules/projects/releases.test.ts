import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import * as projectsApi from '@/api/projects';
import { RESET_STORE } from '../../methodsTypes';
import { FETCH_PROJECT_RELEASES } from './actionTypes';
import projects from './index';

vi.mock('@/api/projects', () => ({ fetchProjectReleases: vi.fn() }));
vi.mock('@/hawk.ts', () => ({ useErrorTracker: () => ({ track: vi.fn() }) }));

type Release = {
  release?: string | null;
  timestamp: number | string;
  newEventsCount?: number;
};

const store = createStore<{ projects: typeof projects.state }>({ modules: { projects } });
const fetchProjectReleases = vi.mocked(projectsApi.fetchProjectReleases);

/**
 * Control request completion to exercise concurrent requests and resets.
 * @returns a pending release request and its settlement functions
 */
function deferred(): {
  promise: Promise<Release[]>;
  resolve: (releases: Release[]) => void;
  reject: (error: Error) => void;
} {
  let resolve!: (releases: Release[]) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<Release[]>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise,
    resolve,
    reject };
}

beforeEach(() => {
  store.commit(RESET_STORE);
  vi.resetAllMocks();
});

describe('projects releases cache', () => {
  it('loads lazily and shares simultaneous requests and cached results', async () => {
    const request = deferred();
    const releases = [{ release: 'build/start#1',
      timestamp: 10 }];

    fetchProjectReleases.mockReturnValueOnce(request.promise);
    expect(store.state.projects.releasesByProject).toEqual({});
    expect(store.getters.getProjectReleases('project')).toEqual([]);
    expect(store.getters.getLatestProjectRelease('project')).toBeNull();
    expect(fetchProjectReleases).not.toHaveBeenCalled();

    const requests = [
      store.dispatch(FETCH_PROJECT_RELEASES, 'project'),
      store.dispatch(FETCH_PROJECT_RELEASES, 'project'),
      store.dispatch(FETCH_PROJECT_RELEASES, 'project'),
    ];

    expect(fetchProjectReleases).toHaveBeenCalledExactlyOnceWith('project');
    request.resolve(releases);
    expect(await Promise.all(requests)).toEqual([releases, releases, releases]);
    expect(store.state.projects.releasesByProject).toEqual({ project: releases });
    expect(store.getters.getProjectReleases('project')).toEqual(releases);
    expect(store.getters.getLatestProjectRelease('project')).toBe('build/start#1');
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'project'))
      .toBe(store.getters.getProjectReleases('project'));
    expect(fetchProjectReleases).toHaveBeenCalledTimes(1);
  });

  it('keeps projects isolated and sorts numeric timestamps, not opaque release identifiers', async () => {
    const first = deferred();
    const second = deferred();
    const oldest = { release: 'v99.0.0',
      timestamp: '9' };
    const middle = { release: 'fffffff',
      timestamp: 80 };
    const newest = { release: 'a/build#2',
      timestamp: '100' };
    const unsorted = [middle, oldest, newest];
    const otherReleases = [{ release: 'other-project',
      timestamp: 200 }];

    fetchProjectReleases.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);

    const firstResult = store.dispatch(FETCH_PROJECT_RELEASES, 'first');
    const secondResult = store.dispatch(FETCH_PROJECT_RELEASES, 'second');

    expect(fetchProjectReleases.mock.calls).toEqual([['first'], ['second']]);
    second.resolve(otherReleases);
    expect(await secondResult).toEqual(otherReleases);
    expect(store.getters.getProjectReleases('first')).toEqual([]);
    expect(store.getters.getLatestProjectRelease('second')).toBe('other-project');

    first.resolve(unsorted);
    expect(await firstResult).toEqual([newest, middle, oldest]);
    expect(unsorted).toEqual([middle, oldest, newest]);
    expect(store.getters.getProjectReleases('first')).toEqual([newest, middle, oldest]);
    expect(store.getters.getLatestProjectRelease('first')).toBe('a/build#2');
    expect(store.getters.getProjectReleases('second')).toEqual(otherReleases);
  });

  it('uses the newest registered release even when it has no events', async () => {
    const latest = { release: 'uploaded-not-observed',
      timestamp: 20,
      newEventsCount: 0 };
    const older = { release: 'observed',
      timestamp: 10,
      newEventsCount: 100 };

    fetchProjectReleases.mockResolvedValueOnce([older, latest]);
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'project')).toEqual([latest, older]);
    expect(store.getters.getLatestProjectRelease('project')).toBe('uploaded-not-observed');
  });

  it('caches an empty list instead of requesting it again', async () => {
    fetchProjectReleases.mockResolvedValueOnce([]);
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'empty')).toEqual([]);
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'empty')).toEqual([]);
    expect(store.state.projects.releasesByProject).toEqual({ empty: [] });
    expect(store.getters.getProjectReleases('empty')).toEqual([]);
    expect(store.getters.getLatestProjectRelease('empty')).toBeNull();
    expect(fetchProjectReleases).toHaveBeenCalledExactlyOnceWith('empty');
  });

  it('does not cache failures and allows a shared failed request to be retried', async () => {
    const request = deferred();
    const error = new Error('Release request failed');
    const releases = [{ release: 'retried',
      timestamp: 10 }];

    fetchProjectReleases.mockReturnValueOnce(request.promise).mockResolvedValueOnce(releases);

    const first = store.dispatch(FETCH_PROJECT_RELEASES, 'project');
    const second = store.dispatch(FETCH_PROJECT_RELEASES, 'project');
    const results = Promise.allSettled([first, second]);

    expect(fetchProjectReleases).toHaveBeenCalledTimes(1);
    request.reject(error);
    expect(await results).toEqual([
      { status: 'rejected',
        reason: error },
      { status: 'rejected',
        reason: error },
    ]);
    expect(store.state.projects.releasesByProject).toEqual({});
    expect(store.getters.getLatestProjectRelease('project')).toBeNull();
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'project')).toEqual(releases);
    expect(fetchProjectReleases).toHaveBeenCalledTimes(2);
  });

  it.each([undefined, null, '', '   ', 'null', 'undefined', ' NULL ', ' Undefined ', 'NaN'])(
    'returns null for a placeholder latest release without falling back to an older release: %j', async (release) => {
      const latest = { release,
        timestamp: 20 };
      const older = { release: 'valid-older-release',
        timestamp: 10 };

      fetchProjectReleases.mockResolvedValueOnce([older, latest]);
      expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'project')).toEqual([latest, older]);
      expect(store.getters.getProjectReleases('project')).toEqual([latest, older]);
      expect(store.getters.getLatestProjectRelease('project')).toBeNull();
    }
  );

  it('clears cached releases on RESET_STORE and fetches them again', async () => {
    const oldReleases = [{ release: 'before-reset',
      timestamp: 10 }];
    const newReleases = [{ release: 'after-reset',
      timestamp: 20 }];

    fetchProjectReleases.mockResolvedValueOnce(oldReleases).mockResolvedValueOnce(newReleases);
    await store.dispatch(FETCH_PROJECT_RELEASES, 'project');
    await store.dispatch(RESET_STORE);
    expect(store.state.projects.releasesByProject).toEqual({});
    expect(store.getters.getProjectReleases('project')).toEqual([]);
    expect(store.getters.getLatestProjectRelease('project')).toBeNull();
    expect(await store.dispatch(FETCH_PROJECT_RELEASES, 'project')).toEqual(newReleases);
    expect(fetchProjectReleases).toHaveBeenCalledTimes(2);
  });

  it('does not repopulate the cache when a pre-reset request resolves late', async () => {
    const request = deferred();
    const releases = [{ release: 'stale',
      timestamp: 10 }];

    fetchProjectReleases.mockReturnValueOnce(request.promise);

    const result = store.dispatch(FETCH_PROJECT_RELEASES, 'project');

    await store.dispatch(RESET_STORE);
    request.resolve(releases);
    expect(await result).toEqual(releases);
    expect(store.state.projects.releasesByProject).toEqual({});
    expect(store.getters.getLatestProjectRelease('project')).toBeNull();
  });

  it.each(['resolve', 'reject'] as const)(
    'does not clear a newer pending request when a pre-reset request settles: %s', async (settle) => {
      const oldRequest = deferred();
      const newRequest = deferred();
      const releases = [{ release: 'fresh',
        timestamp: 20 }];

      fetchProjectReleases.mockReturnValueOnce(oldRequest.promise).mockReturnValueOnce(newRequest.promise);

      const oldResult = store.dispatch(FETCH_PROJECT_RELEASES, 'project');
      const oldSettlement = Promise.allSettled([oldResult]);

      store.commit(RESET_STORE);

      const newResult = store.dispatch(FETCH_PROJECT_RELEASES, 'project');

      if (settle === 'resolve') {
        oldRequest.resolve([{ release: 'stale',
          timestamp: 10 }]);
      } else {
        oldRequest.reject(new Error('Stale request failed'));
      }
      await oldSettlement;
      expect(store.state.projects.releasesByProject).toEqual({});

      const sharedResult = store.dispatch(FETCH_PROJECT_RELEASES, 'project');

      expect(fetchProjectReleases).toHaveBeenCalledTimes(2);
      newRequest.resolve(releases);
      expect(await Promise.all([newResult, sharedResult])).toEqual([releases, releases]);
      expect(store.getters.getProjectReleases('project')).toEqual(releases);
      expect(store.getters.getLatestProjectRelease('project')).toBe('fresh');
    }
  );

  it('does not overwrite a new cache when an older request resolves after it', async () => {
    const oldRequest = deferred();
    const releases = [{ release: 'fresh',
      timestamp: 20 }];

    fetchProjectReleases.mockReturnValueOnce(oldRequest.promise).mockResolvedValueOnce(releases);

    const oldResult = store.dispatch(FETCH_PROJECT_RELEASES, 'project');

    store.commit(RESET_STORE);
    await store.dispatch(FETCH_PROJECT_RELEASES, 'project');
    oldRequest.resolve([{ release: 'stale',
      timestamp: 10 }]);
    await oldResult;
    expect(store.getters.getProjectReleases('project')).toEqual(releases);
    expect(store.getters.getLatestProjectRelease('project')).toBe('fresh');
  });
});
