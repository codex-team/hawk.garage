import { DEMO_EVENTS } from '@/api/mock-db';
import type { HawkEvent } from '@/types/events';

/**
 * Mock: getRepetitionsPortion
 *
 * Returns repetitions of the first demo event with different browsers/timestamps
 */
export default function mockGetRepetitionsPortion() {
  const baseEvent = DEMO_EVENTS[0];

  // Create variations of the same event with different context
  const variations = [
    { browser: 'Chrome 120.0.0 (Windows NT 10.0; Win64; x64)', os: 'Windows 10', timeOffset: 0 },
    { browser: 'Safari/537.36 (Macintosh; Intel Mac OS X 10_15_7)', os: 'macOS 10.15.7', timeOffset: -3600000 },
    { browser: 'Mobile Safari 17.2 (iPhone; CPU iPhone OS 17_2 like Mac OS X)', os: 'iOS 17.2', timeOffset: -7200000 },
    { browser: 'Firefox 122.0 (X11; Linux x86_64)', os: 'Linux', timeOffset: -10800000 },
  ];

  const repetitions: HawkEvent[] = variations.map((variant, index) => ({
    ...baseEvent,
    id: `507f1f77bcf86cd79943901${4 + index}`,
    timestamp: Date.now() + variant.timeOffset,
    payload: {
      ...baseEvent.payload,
      context: {
        ...baseEvent.payload.context,
        browser: variant.browser,
        os: variant.os,
      },
    },
  }));

  return {
    data: {
      project: {
        event: {
          repetitionsPortion: {
            repetitions,
            nextCursor: null,
          },
        },
      },
    },
    errors: [],
  };
}

