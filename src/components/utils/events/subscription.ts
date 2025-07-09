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
  const eventDate = new Date(eventTimestamp * 1000);
  const subscriptionExpiry = new Date(workspaceLastChargeDate);

  return eventDate > subscriptionExpiry;
}
