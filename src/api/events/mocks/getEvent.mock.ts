import { DEMO_EVENTS } from '@/api/mock-db';
import type { HawkEvent } from '@hawk.so/types';

/**
 * Mock: getEvent
 *
 * Returns a single event from DEMO_EVENTS by eventId
 * Falls back to first event if not found
 */
export default function mockGetEvent(): HawkEvent | null {
  // In demo mode, we just return the first demo event
  // In a real scenario, we could match by eventId from args
  const event = DEMO_EVENTS[0];

  return event ?? null;
}
