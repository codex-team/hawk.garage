/**
 * Check if event was received after subscription expiration
 *
 * @param eventTimestamp - { number } event timestamp
 * @param workspaceLastChargeDate - { Date } workspace last charge date
 * @returns {boolean} - true if event is after subscription expiry
 */
export function isEventAfterSubscriptionExpiry(
  eventTimestamp: number,
  workspaceLastChargeDate: Date
): boolean {
  const SECONDS_TO_MILLISECONDS = 1000;
  const eventDate = new Date(eventTimestamp * SECONDS_TO_MILLISECONDS);
  const subscriptionExpiry = new Date(workspaceLastChargeDate);

  return eventDate > subscriptionExpiry;
}
