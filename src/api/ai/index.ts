import axios from 'axios';
import { API_ENDPOINT } from '@/api';
import { withDemoMock } from '@/utils/withDemoMock';

/**
 * Options for consuming an AI suggestion stream.
 */
export interface AiSuggestionStreamOptions {
  /** Abort the active stream when the consumer is no longer interested in it. */
  signal: AbortSignal;
  /** Receive each decoded text fragment in order. */
  onTextDelta: (delta: string) => void;
  /** The answer was refused; whatever arrived before is not an answer. */
  onError: (message: string) => void;
}

/**
 * Part of the answer as the API sends it. Fields beyond the type belong to
 * particular parts, so each is checked before use.
 */
interface AiSuggestionStreamPart {
  /** Which kind of part this is; the ones not handled carry stream structure. */
  type: string;
  /** Next piece of the answer, on a text-delta part. */
  delta?: string;
  /** Why the answer was refused, on an error part. */
  errorText?: string;
}

/**
 * Create an abort error compatible with Fetch stream cancellation.
 */
function createAbortError(): DOMException {
  return new DOMException('The AI suggestion stream was aborted.', 'AbortError');
}

/**
 * Hand one server-sent event to the matching callback.
 * @param frame - single event, without its trailing blank line
 * @param options - cancellation signal and stream consumers
 */
function consumeFrame(frame: string, options: AiSuggestionStreamOptions): void {
  const line = frame.trim();

  if (!line.startsWith('data:')) {
    return;
  }

  const payload = line.slice('data:'.length).trim();

  if (payload === '' || payload === '[DONE]') {
    return;
  }

  let part: AiSuggestionStreamPart;

  try {
    part = JSON.parse(payload) as AiSuggestionStreamPart;
  } catch {
    return;
  }

  if (part.type === 'text-delta' && typeof part.delta === 'string') {
    options.onTextDelta(part.delta);
  }

  if (part.type === 'error' && typeof part.errorText === 'string') {
    options.onError(part.errorText);
  }
}

/**
 * Read a server-sent event body and dispatch each event to the consumer.
 *
 * Events are buffered rather than handled per read, since a read returns
 * whatever bytes arrived and an event can straddle two of them.
 * @param response - text/event-stream HTTP response
 * @param options - cancellation signal and stream consumers
 */
export async function consumeAiSuggestionStream(
  response: Response,
  options: AiSuggestionStreamOptions
): Promise<void> {
  const { signal } = options;

  if (!response.body) {
    throw new Error('AI suggestion stream response has no body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal.aborted) {
        throw createAbortError();
      }

      const { done, value } = await reader.read();

      buffer += decoder.decode(value, { stream: !done });

      let boundary = buffer.indexOf('\n\n');

      while (boundary !== -1) {
        consumeFrame(buffer.slice(0, boundary), options);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf('\n\n');
      }

      if (done) {
        break;
      }
    }

    consumeFrame(buffer, options);
  } finally {
    reader.releaseLock();
  }
}

/**
 * Body the API sends instead of a stream when it refuses the request.
 */
interface AiSuggestionStreamErrorBody {
  /** Reason the request was refused. */
  error?: string;
}

/**
 * Read the error message the API sends with a failed response.
 * @param response - response with a non-2xx status
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json() as AiSuggestionStreamErrorBody;

    return body.error ?? `AI suggestion stream failed with status ${response.status}.`;
  } catch {
    return `AI suggestion stream failed with status ${response.status}.`;
  }
}

/**
 * Request the suggestion stream and hand each fragment to the consumer as it arrives.
 * @param projectId - project event is related to
 * @param eventId - event to fetch AI suggestion for
 * @param originalEventId - id of the event the repetition belongs to
 * @param options - cancellation signal and text-delta consumer
 */
export const streamEventAiSuggestion = withDemoMock(
  async function streamEventAiSuggestion(
    projectId: string,
    eventId: string,
    originalEventId: string,
    options: AiSuggestionStreamOptions
  ): Promise<void> {
    const query = new URLSearchParams({
      projectId,
      eventId,
      originalEventId,
    });

    /**
     * Streaming needs the response body as it arrives, which axios does not expose,
     * so the token the axios interceptors would have attached is passed by hand.
     */
    const authorization = axios.defaults.headers.common.Authorization;
    const headers = new Headers();

    if (typeof authorization === 'string') {
      headers.set('Authorization', authorization);
    }

    const response = await fetch(`${API_ENDPOINT}/integration/ai/stream?${query.toString()}`, {
      signal: options.signal,
      headers,
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    await consumeAiSuggestionStream(response, options);
  },
  '/src/api/ai/mocks/streamEventAiSuggestion.mock.ts'
);
