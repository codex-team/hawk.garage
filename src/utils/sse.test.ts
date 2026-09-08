import { describe, expect, it } from 'vitest';
import { readServerSentEvents } from './sse';

/**
 * Build a byte stream that yields each string as its own chunk, in order.
 * @param chunks - raw bytes to enqueue, one per stream read
 */
function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      chunks.forEach(chunk => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

/**
 * Drain a generator into an array.
 * @param source - async generator under test
 */
async function collect<T>(source: AsyncGenerator<T>): Promise<T[]> {
  const items: T[] = [];

  for await (const item of source) {
    items.push(item);
  }

  return items;
}

describe('readServerSentEvents', () => {
  it('should read a single event', async () => {
    const stream = streamOf(['data: hello\n\n']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello']);
  });

  it('should read events split across reads', async () => {
    const stream = streamOf(['data: hel', 'lo\n\ndata: wor', 'ld\n\n']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello', 'world']);
  });

  it('should recognize a CRLF blank line as the event boundary', async () => {
    const stream = streamOf(['data: hello\r\n\r\ndata: world\r\n\r\n']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello', 'world']);
  });

  it('should read a final event with no trailing blank line', async () => {
    const stream = streamOf(['data: hello\n\ndata: world']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello', 'world']);
  });

  it('should skip an event with no data line', async () => {
    const stream = streamOf(['event: ping\n\ndata: hello\n\n']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello']);
  });

  it('should skip an event with an empty data payload', async () => {
    const stream = streamOf(['data:\n\ndata: hello\n\n']);

    expect(await collect(readServerSentEvents(stream, new AbortController().signal))).toEqual(['hello']);
  });

  it('should stop once the signal is already aborted', async () => {
    const controller = new AbortController();

    controller.abort();

    const stream = streamOf(['data: hello\n\n']);

    await expect(collect(readServerSentEvents(stream, controller.signal))).rejects.toMatchObject({ name: 'AbortError' });
  });
});
