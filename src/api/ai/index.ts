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
 * Stream an AI suggestion for an event.
 *
 * Does nothing outside demo mode.
 * @param projectId - project event is related to
 * @param eventId - event to fetch AI suggestion for
 * @param originalEventId - id of the original event
 * @param options - cancellation signal and text-delta consumer
 */
export const streamEventAiSuggestion = withDemoMock(
  async function streamEventAiSuggestion(
    _projectId: string,
    _eventId: string,
    _originalEventId: string,
    _options: AiSuggestionStreamOptions
  ): Promise<void> {
    return undefined;
  },
  '/src/api/ai/mocks/streamEventAiSuggestion.mock.ts'
);
