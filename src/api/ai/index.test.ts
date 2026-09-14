import { describe, expect, it } from 'vitest';
import { consumeAiSuggestionStream } from './index';

/**
 * Consume a response through the same callbacks as the dialog.
 * @param frames - SSE data payloads
 * @returns received answer text and errors
 */
async function consume(frames: string[]): Promise<{ text: string;
  errors: string[]; }> {
  const received = { text: '',
    errors: [] as string[] };
  const body = new Response(frames.map(frame => `data: ${frame}\n\n`).join('')).body!;

  await consumeAiSuggestionStream(body, {
    signal: new AbortController().signal,
    onTextDelta: (delta) => {
      received.text += delta;
    },
    onError: (message) => {
      received.errors.push(message);
    },
  });

  return received;
}

describe('consumeAiSuggestionStream', () => {
  it('should retain the answer when a DONE sentinel follows the text', async () => {
    const result = await consume([
      JSON.stringify({ type: 'text-delta',
        id: '1',
        delta: 'first\nsecond' }),
      '[DONE]',
    ]);

    expect(result).toEqual({ text: 'first\nsecond',
      errors: [] });
  });

  it('should report malformed JSON instead of accepting a damaged answer', async () => {
    const result = await consume(['broken json']);

    expect(result.errors).toEqual(['The AI suggestion stream sent a message that could not be read.']);
  });

  it('should stop dispatching deltas once the answer is refused', async () => {
    const result = await consume([
      JSON.stringify({ type: 'text-delta',
        id: '1',
        delta: 'partial' }),
      JSON.stringify({ type: 'error',
        errorText: 'refused' }),
      JSON.stringify({ type: 'text-delta',
        id: '1',
        delta: 'withdrawn' }),
    ]);

    expect(result).toEqual({ text: 'partial',
      errors: ['refused'] });
  });
});
