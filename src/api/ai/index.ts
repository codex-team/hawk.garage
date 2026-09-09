import type { AiStreamPart } from '@hawk.so/types';
import * as api from '@/api';
import { withDemoMock } from '@/utils/withDemoMock';
import { readServerSentEvents } from '@/utils/sse';

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
 * Read an AI stream body and dispatch each part to the consumer,
 * stopping once the answer is refused.
 * @param stream - text/event-stream response body
 * @param options - cancellation signal and stream consumers
 */
export async function consumeAiSuggestionStream(
  stream: ReadableStream<Uint8Array>,
  options: AiSuggestionStreamOptions
): Promise<void> {
  for await (const payload of readServerSentEvents(stream, options.signal)) {
    let part: AiStreamPart;

    try {
      part = JSON.parse(payload) as AiStreamPart;
    } catch {
      options.onError('The AI suggestion stream sent a message that could not be read.');

      return;
    }

    switch (part.type) {
      case 'text-delta':
        options.onTextDelta(part.delta);
        break;
      case 'error':
        options.onError(part.errorText);

        return;
    }
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

    const stream = await api.callRestStream(`/integration/ai/stream?${query.toString()}`, {
      signal: options.signal,
    });

    await consumeAiSuggestionStream(stream, options);
  },
  '/src/api/ai/mocks/streamEventAiSuggestion.mock.ts'
);
