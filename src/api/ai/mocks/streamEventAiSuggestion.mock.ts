import {
  consumeAiSuggestionTextStream,
  type AiSuggestionStreamOptions
} from '..';

const MOCK_RESPONSE_TEXT = `# Suggested fix

Проверьте, что \`userId\` задан перед использованием.

\`\`\`ts
if (!userId) {
  return;
}
\`\`\`

This prevents the request from continuing with invalid input.

# How to avoid such errors

We don't know.`;

const MOCK_STREAM_DELAY = 120;
const MOCK_STREAM_CHUNK_COUNT = 5;

/**
 * Create an abort error compatible with Fetch stream cancellation.
 */
function createAbortError(): DOMException {
  return new DOMException('The AI suggestion stream was aborted.', 'AbortError');
}

/**
 * Wait before emitting the next mock chunk, unless the stream is aborted.
 * @param signal - abort signal for the active stream
 */
function waitForMockChunk(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());

      return;
    }

    let timer: number;

    const onAbort = (): void => {
      window.clearTimeout(timer);
      reject(createAbortError());
    };

    timer = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, MOCK_STREAM_DELAY);

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Build a plain UTF-8 response with a readable text stream.
 * @param signal - abort signal for the active stream
 */
function createMockResponse(signal: AbortSignal): Response {
  const bytes = new TextEncoder().encode(MOCK_RESPONSE_TEXT);
  const chunkSize = Math.ceil(bytes.length / MOCK_STREAM_CHUNK_COUNT);

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let start = 0; start < bytes.length; start += chunkSize) {
          await waitForMockChunk(signal);
          controller.enqueue(bytes.slice(start, start + chunkSize));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}

/**
 * Stream a deterministic plain-text suggestion in demo mode.
 * @param options - cancellation signal and text-delta consumer
 */
export default async function mockStreamEventAiSuggestion(
  _projectId: string,
  _eventId: string,
  _originalEventId: string,
  options: AiSuggestionStreamOptions
): Promise<void> {
  await consumeAiSuggestionTextStream(createMockResponse(options.signal), options);
}
