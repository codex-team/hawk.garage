import { DEMO_EVENTS } from '@/api/mock-db';
import type { HawkEvent } from '@/types/events';
import { MILLISECONDS_IN_HOUR } from '@/utils/time';

const REPETITION_ID_OFFSET = 4;
const ONE_HOUR = MILLISECONDS_IN_HOUR;
const TWO_HOURS = MILLISECONDS_IN_HOUR * 2;
const THREE_HOURS = MILLISECONDS_IN_HOUR * 3;

/**
 * Mock: getRepetitionsPortion
 *
 * Returns repetitions of the first demo event with different browsers/timestamps
 */
export default function mockGetRepetitionsPortion(): {
  data: {
    project: {
      event: {
        repetitionsPortion: {
          repetitions: HawkEvent[];
          nextCursor: null;
        };
      };
    };
  };
  errors: unknown[];
} {
  const baseEvent = DEMO_EVENTS[0];

  // Create variations of the same event with different context
  const variations = [
    { browser: 'Chrome 120.0.0 (Windows NT 10.0; Win64; x64)', os: 'Windows 10', timeOffset: 0 },
    { browser: 'Safari/537.36 (Macintosh; Intel Mac OS X 10_15_7)', os: 'macOS 10.15.7', timeOffset: -ONE_HOUR },
    { browser: 'Mobile Safari 17.2 (iPhone; CPU iPhone OS 17_2 like Mac OS X)', os: 'iOS 17.2', timeOffset: -TWO_HOURS },
    { browser: 'Firefox 122.0 (X11; Linux x86_64)', os: 'Linux', timeOffset: -THREE_HOURS },
  ];

  const repetitions: HawkEvent[] = variations.map((variant, index) => ({
    ...baseEvent,
    id: `507f1f77bcf86cd79943901${REPETITION_ID_OFFSET + index}`,
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

