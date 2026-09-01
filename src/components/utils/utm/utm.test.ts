import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractUtmQuery, getUtmFromQuery, mergeUtmIntoQuery } from './utm.ts';

describe('UTM query persistence', () => {
  describe('extractUtmQuery', () => {
    it('should keep only valid utm_* params', () => {
      // Arrange
      const query = {
        utm_source: 'google',
        utm_medium: 'cpc',
        success: 'signup',
        utm_invalid: 'nope',
      };

      // Act
      const result = extractUtmQuery(query);

      // Assert
      assert.deepEqual(result, {
        utm_source: 'google',
        utm_medium: 'cpc',
      });
    });

    it('should drop invalid UTM values', () => {
      // Arrange
      const query = { utm_source: 'google@bad' };

      // Act
      const result = extractUtmQuery(query);

      // Assert
      assert.deepEqual(result, {});
    });
  });

  describe('mergeUtmIntoQuery', () => {
    it('should copy UTM onto the next route when it has none', () => {
      // Arrange
      const toQuery = { success: 'signup', emailPrefilled: 'user@test.com' };
      const fromQuery = { utm_source: 'google', utm_campaign: 'spring' };

      // Act
      const result = mergeUtmIntoQuery(toQuery, fromQuery);

      // Assert
      assert.deepEqual(result, {
        success: 'signup',
        emailPrefilled: 'user@test.com',
        utm_source: 'google',
        utm_campaign: 'spring',
      });
    });

    it('should not overwrite UTM already present on the next route', () => {
      // Arrange
      const toQuery = { utm_source: 'newsletter' };
      const fromQuery = { utm_source: 'google' };

      // Act
      const result = mergeUtmIntoQuery(toQuery, fromQuery);

      // Assert
      assert.equal(result, null);
    });

    it('should return null when there is no UTM to copy', () => {
      // Arrange
      const toQuery = { foo: 'bar' };
      const fromQuery = { foo: 'baz' };

      // Act
      const result = mergeUtmIntoQuery(toQuery, fromQuery);

      // Assert
      assert.equal(result, null);
    });
  });

  describe('getUtmFromQuery', () => {
    it('should return API-shaped UTM for signup', () => {
      // Arrange
      const query = { utm_source: 'google', utm_medium: 'cpc', foo: 'bar' };

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
      const query = { success: 'signup' };

      // Act
      const result = getUtmFromQuery(query);

      // Assert
      assert.equal(result, undefined);
    });
  });
});
