/**
 * Common API response format
 */
export interface APIResponse<T = unknown> {
  recordId: string;
  record: T;
}
