/**
 * Check whether an error represents an aborted browser operation.
 * @param error - value caught from an asynchronous operation
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
