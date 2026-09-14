/**
 * Boundary between two SSE events: a blank line, written as any pair of line endings.
 */
const EVENT_BOUNDARY = /\r?\n\r?\n/;

/**
 * Create an abort error compatible with Fetch stream cancellation.
 */
export function createAbortError(): DOMException {
  return new DOMException('The stream was aborted.', 'AbortError');
}

/**
 * Read one event's `data:` line.
 * @param frame - single event, without its trailing blank line
 * @returns the payload, or null if the event carries no data
 */
function readDataPayload(frame: string): string | null {
  const line = frame.trim();

  if (!line.startsWith('data:')) {
    return null;
  }

  const payload = line.slice('data:'.length).trim();

  return payload === '' ? null : payload;
}

/**
 * Read a byte stream framed as Server-Sent Events and yield each event's `data:` payload.
 *
 * Events are buffered rather than handled per read, since a read returns whatever bytes
 * arrived and an event can straddle two of them.
 * @param stream - text/event-stream body
 * @param signal - abort the read loop when the consumer is no longer interested
 * @yields each event's `data:` payload, in order
 */
export async function* readServerSentEvents(
  stream: ReadableStream<Uint8Array>,
  signal: AbortSignal
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal.aborted) {
        throw createAbortError();
      }

      const { done, value } = await reader.read();

      buffer += decoder.decode(value, { stream: !done });

      let boundary = buffer.match(EVENT_BOUNDARY);

      while (boundary?.index !== undefined) {
        const payload = readDataPayload(buffer.slice(0, boundary.index));

        if (payload !== null) {
          yield payload;
        }

        buffer = buffer.slice(boundary.index + boundary[0].length);
        boundary = buffer.match(EVENT_BOUNDARY);
      }

      if (done) {
        break;
      }
    }

    const payload = readDataPayload(buffer);

    if (payload !== null) {
      yield payload;
    }
  } finally {
    reader.releaseLock();
  }
}
