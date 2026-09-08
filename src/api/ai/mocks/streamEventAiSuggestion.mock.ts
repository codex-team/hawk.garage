import type { AiStreamPart } from '@hawk.so/types';
import {
  consumeAiSuggestionStream,
  type AiSuggestionStreamOptions
} from '..';
import { createAbortError } from '@/utils/sse';
import { isAbortError } from '@/utils/errors';

const MOCK_RESPONSE_TEXT = `# Cause

The crash happens because \`workspace.subscription\` is \`undefined\` for workspaces created before the billing migration, and the code assumes it **always** exists.

## Short summary

\`checkAccess\` reads \`workspace.subscription.status\` without checking whether \`subscription\` exists at all. It fails for *every* workspace that predates the migration, not just some of them.

\`\`\`ts
function checkAccess(workspace: Workspace): boolean {
  return workspace.subscription.status === 'active';
}
\`\`\`

> Any workspace created before the migration hits this on the very first check. It isn't intermittent.

The failure looks like this:

- \`TypeError: Cannot read properties of undefined (reading 'status')\`
- Thrown on the first protected action after signing in
- Never recovers on retry, since the workspace record never changes

## How to fix it

1. Guard the read with an explicit \`subscription\` check, or use [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) before reading \`status\`
2. Backfill the missing field for the affected workspaces
3. Remove the guard once the backfill has run

Either step alone stops the crash. Doing both keeps the code simple once the backfill lands.`;

const MOCK_STREAM_DELAY = 120;
const MOCK_STREAM_CHUNK_SIZE = 100;

const MOCK_TEXT_BLOCK_ID = '0';

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
 * Build a text/event-stream body carrying the mock answer.
 * @param signal - abort signal for the active stream
 */
function createMockStream(signal: AbortSignal): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  /**
   * Wrap a stream part the way the API frames it.
   * @param part - part to send, carrying the block id the API puts on text
   *               parts and the consumer ignores
   */
  const frame = (part: AiStreamPart & { id?: string }): Uint8Array =>
    encoder.encode(`data: ${JSON.stringify(part)}\n\n`);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let start = 0; start < MOCK_RESPONSE_TEXT.length; start += MOCK_STREAM_CHUNK_SIZE) {
          await waitForMockChunk(signal);
          controller.enqueue(frame({
            type: 'text-delta',
            id: MOCK_TEXT_BLOCK_ID,
            delta: MOCK_RESPONSE_TEXT.slice(start, start + MOCK_STREAM_CHUNK_SIZE),
          }));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Stream a deterministic suggestion in demo mode.
 * @param options - cancellation signal and text-delta consumer
 */
export default async function mockStreamEventAiSuggestion(
  _projectId: string,
  _eventId: string,
  _originalEventId: string,
  options: AiSuggestionStreamOptions
): Promise<void> {
  try {
    await consumeAiSuggestionStream(createMockStream(options.signal), options);
  } catch (error) {
    if (!isAbortError(error)) {
      throw error;
    }
  }
}
