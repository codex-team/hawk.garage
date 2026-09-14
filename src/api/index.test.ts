import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { callRestStream, setAuthToken, setupApiModuleHandlers } from './index';

const HTTP_STATUS_UNAUTHORIZED = 401;

/**
 * Absolute, so the request does not depend on VITE_API_ENDPOINT.
 */
const STREAM_URL = 'https://api.hawk.test/stream';

/**
 * Build a JSON response.
 * @param status - HTTP status
 * @param body - response body
 * @returns response with the body as JSON
 */
function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * Build a response that streams text.
 * @param text - body text
 * @returns response with a streamed body
 */
function streamResponse(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  return new Response(stream, { status: 200 });
}

/**
 * Read every fetch's Authorization header as it happens, and answer each call
 * with the next response from the given list.
 * @param responses - one Response per expected fetch call, in order
 * @returns Authorization headers of the calls
 */
function mockFetchSequence(responses: Response[]): { authHeaders: (string | null)[] } {
  const authHeaders: (string | null)[] = [];
  let call = 0;

  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    authHeaders.push((input as Request).headers.get('Authorization'));

    return responses[call++];
  }));

  return { authHeaders };
}

beforeAll(() => {
  setupApiModuleHandlers({
    onTokenExpired: () => Promise.resolve('refreshed-token'),
    onAuthError: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  setAuthToken(null);
});

describe('callRestStream', () => {
  it('should return the response body on success', async () => {
    setAuthToken('valid-token');
    mockFetchSequence([streamResponse('hello')]);

    const stream = await callRestStream(STREAM_URL);

    await expect(new Response(stream).text()).resolves.toBe('hello');
  });

  it('should refresh the token and retry once on a 401', async () => {
    setAuthToken('stale-token');

    const { authHeaders } = mockFetchSequence([
      jsonResponse(HTTP_STATUS_UNAUTHORIZED, { error: 'Access token is expired' }),
      streamResponse('hello'),
    ]);

    const stream = await callRestStream(STREAM_URL);

    await expect(new Response(stream).text()).resolves.toBe('hello');
    expect(authHeaders).toEqual(['Bearer stale-token', 'Bearer refreshed-token']);
  });

  it('should throw the server message when the retried request still fails', async () => {
    setAuthToken('stale-token');
    mockFetchSequence([
      jsonResponse(HTTP_STATUS_UNAUTHORIZED, { error: 'Access token is expired' }),
      jsonResponse(HTTP_STATUS_UNAUTHORIZED, { error: 'Refresh token is invalid' }),
    ]);

    await expect(callRestStream(STREAM_URL)).rejects.toThrow('Refresh token is invalid');
  });

  it('should report an auth error when the token refresh fails', async () => {
    const onAuthError = vi.fn();

    setupApiModuleHandlers({
      onTokenExpired: () => Promise.reject(new Error('refresh token expired')),
      onAuthError,
    });
    setAuthToken('stale-token');
    mockFetchSequence([jsonResponse(HTTP_STATUS_UNAUTHORIZED, { error: 'Access token is expired' })]);

    await expect(callRestStream(STREAM_URL)).rejects.toThrow();
    expect(onAuthError).toHaveBeenCalledOnce();

    setupApiModuleHandlers({
      onTokenExpired: () => Promise.resolve('refreshed-token'),
      onAuthError: vi.fn(),
    });
  });
});
