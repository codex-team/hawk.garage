import { getDemoEventsByProjectId } from '@/api/mock-db';
import type { HawkEvent } from '@hawk.so/types';

/**
 * Mock: getEvent
 *
 * Returns a single event from DEMO_EVENTS by eventId
 * Falls back to first event if not found
 */
export default function mockGetEvent(
  projectId?: string,
  eventId?: string,
  originalEventId?: string
): HawkEvent | null {
  const events = getDemoEventsByProjectId(projectId);
  const event = events.find(item =>
    item.id === eventId || item.originalEventId === originalEventId
  ) || events[0];

  return event ?? null;
}
