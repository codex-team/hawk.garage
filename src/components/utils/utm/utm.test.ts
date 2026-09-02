import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import {
  captureUtmFromQuery,
  getStoredUtm,
  getUtmFromQuery,
  saveDemoUtm,
  UTM_STORAGE_KEY
} from './utm.ts';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    removeItem(key: string) {
      data.delete(key);
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
  };
}

describe('UTM session storage', () => {
  beforeEach(() => {
    globalThis.sessionStorage = createMemoryStorage();
  });

  describe('getUtmFromQuery', () => {
    it('should return API-shaped UTM from query', () => {
      // Arrange
      const query = {
        utm_source: 'google',
        utm_medium: 'cpc',
        foo: 'bar',
      };

      // Act
      const result = getUtmFromQuery(query);

      // Assert
      assert.deepEqual(result, {
        source: 'google',
        medium: 'cpc',
      });
    });

    it('should return undefined when query has no valid UTM', () => {
      // Arrange
      const query = {
        success: 'signup',
        utm_source: 'google@bad',
      };

      // Act
      const result = getUtmFromQuery(query);

      // Assert
      assert.equal(result, undefined);
    });
  });

  describe('captureUtmFromQuery', () => {
    it('should save valid UTM from the landing URL', () => {
      // Arrange
      const query = {
        utm_source: 'google',
        utm_campaign: 'spring',
      };

      // Act
      captureUtmFromQuery(query);

      // Assert
      assert.deepEqual(JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) ?? ''), {
        source: 'google',
        campaign: 'spring',
      });
    });

    it('should not clear stored UTM when the next URL has none', () => {
      // Arrange
      captureUtmFromQuery({
        utm_source: 'google',
      });

      // Act
      captureUtmFromQuery({
        success: 'signup',
      });

      // Assert
      assert.deepEqual(getStoredUtm(), {
        source: 'google',
      });
    });

    it('should keep the first campaign UTM if a later URL has different tags', () => {
      // Arrange
      captureUtmFromQuery({
        utm_source: 'google',
        utm_medium: 'cpc',
      });

      // Act
      captureUtmFromQuery({
        utm_source: 'facebook',
        utm_campaign: 'later',
      });

      // Assert
      assert.deepEqual(getStoredUtm(), {
        source: 'google',
        medium: 'cpc',
        campaign: 'later',
      });
    });
  });

  describe('saveDemoUtm', () => {
    it('should overwrite source with demo', () => {
      // Arrange
      captureUtmFromQuery({
        utm_source: 'google',
        utm_medium: 'cpc',
      });

      // Act
      saveDemoUtm();

      // Assert
      assert.deepEqual(getStoredUtm(), {
        source: 'demo',
        medium: 'cpc',
      });
    });
  });

  describe('getStoredUtm', () => {
    it('should return stored UTM for signup', () => {
      // Arrange
      captureUtmFromQuery({
        utm_source: 'google',
        utm_medium: 'cpc',
      });

      // Act
      const result = getStoredUtm();

      // Assert
      assert.deepEqual(result, {
        source: 'google',
        medium: 'cpc',
      });
    });

    it('should return undefined when nothing is stored', () => {
      // Arrange
      // Act
      const result = getStoredUtm();

      // Assert
      assert.equal(result, undefined);
    });

    it('should return undefined for invalid stored JSON', () => {
      // Arrange
      sessionStorage.setItem(UTM_STORAGE_KEY, '{not-json');

      // Act
      const result = getStoredUtm();

      // Assert
      assert.equal(result, undefined);
    });
  });
});
