import { DEMO_EVENTS } from '@/api/mock-db';

/**
 * Mock: getEvent
 *
 * Returns a single event from DEMO_EVENTS by eventId
 * Falls back to first event if not found
 */
export default function mockGetEvent() {
  // In demo mode, we just return the first demo event
  // In a real scenario, we could match by eventId from args
  return DEMO_EVENTS[0] || null;
}

