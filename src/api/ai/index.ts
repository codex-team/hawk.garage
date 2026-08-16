import axios from 'axios';
import { API_ENDPOINT } from '@/api';
import { withDemoMock } from '@/utils/withDemoMock';

/**
 * Options for consuming an AI suggestion text stream.
 */
export interface AiSuggestionStreamOptions {
  /** Abort the active stream when the consumer is no longer interested in it. */
  signal: AbortSignal;
  /** Receive each decoded text fragment in order. */
  onTextDelta: (delta: string) => void;
}

/**
 * Create an abort error compatible with Fetch stream cancellation.
 */
function createAbortError(): DOMException {
  return new DOMException('The AI suggestion stream was aborted.', 'AbortError');
}

/**
 * Decode a plain-text response body and forward text fragments to the consumer.
 * @param response - plain-text HTTP response
 * @param options - cancellation signal and text-delta consumer
 */
export async function consumeAiSuggestionTextStream(
  response: Response,
  options: AiSuggestionStreamOptions
): Promise<void> {
  const { signal, onTextDelta } = options;

  if (!response.body) {
    throw new Error('AI suggestion stream response has no body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      if (signal.aborted) {
        throw createAbortError();
      }

      const { done, value } = await reader.read();
      const delta = decoder.decode(value, { stream: !done });

      if (delta) {
        onTextDelta(delta);
      }

      if (done) {
        break;
      }
    }

    const remainingText = decoder.decode();

    if (remainingText) {
      onTextDelta(remainingText);
    }
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

    await consumeAiSuggestionTextStream(response, options);
  },
  '/src/api/ai/mocks/streamEventAiSuggestion.mock.ts'
);
