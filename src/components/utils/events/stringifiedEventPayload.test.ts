import { describe, expect, it } from 'vitest';
import { stringifyEventPayload } from './stringifiedEventPayload';
import type { HawkEventPayload } from '@/types/events';

/**
 * Creates a minimal event payload for tests
 * @param overrides - Partial payload overrides
 * @returns Event payload
 */
function createPayload(overrides: Partial<HawkEventPayload> = {}): HawkEventPayload {
  return {
    title: 'TypeError: Cannot read properties of undefined',
    backtrace: [],
    get: {},
    post: {},
    headers: {},
    release: '',
    user: {},
    context: {},
    addons: {},
    ...overrides,
  };
}

describe('stringifyEventPayload', () => {
  it('includes formatted breadcrumbs when present', () => {
    const firstTimestamp = Date.parse('2026-11-19T12:00:00.000Z');
    const secondTimestamp = Date.parse('2026-11-19T12:00:00.500Z');
    const result = stringifyEventPayload(createPayload({
      breadcrumbs: [
        {
          timestamp: firstTimestamp,
          type: 'request',
          category: 'fetch',
          message: 'GET /api/me 200',
          level: 'info',
          data: {
            statusCode: 200,
          },
        },
        {
          timestamp: secondTimestamp,
          type: 'ui',
          category: 'ui.click',
          message: 'Click on Submit',
          level: 'info',
        },
      ],
    }));

    expect(result).toContain('## Breadcrumbs');
    expect(result).toContain('[2026-11-19T12:00:00.000Z | request | fetch | info] GET /api/me 200\nstatusCode: 200');
    expect(result).toContain('[2026-11-19T12:00:00.500Z | ui | ui.click | info] Click on Submit');
  });

  it('omits breadcrumbs section when breadcrumbs are missing or empty', () => {
    expect(stringifyEventPayload(createPayload())).not.toContain('## Breadcrumbs');
    expect(stringifyEventPayload(createPayload({ breadcrumbs: [] }))).not.toContain('## Breadcrumbs');
  });
});
