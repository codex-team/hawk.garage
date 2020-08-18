/**
 * Common API response format
 */
export interface APIResponse<T = unknown> {
  /**
   * Modified record identifier
   */
  recordId: string;

  /**
   * Modified record
   */
  record: T;
}
