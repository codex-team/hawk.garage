import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamPacer, type StreamPacer } from './streamPacer';

/**
 * Delay between words in tests, in milliseconds.
 */
const WORD_DELAY = 30;

/**
 * Longest lag in tests: room for ten words.
 */
const MAX_LAG = 300;

/**
 * Words in a burst: three times what the lag leaves room for.
 */
const BURST_WORDS = 30;

/**
 * Words that may wait: one fewer than the lag has room for.
 */
const MAX_BACKLOG = MAX_LAG / WORD_DELAY - 1;

/**
 * Pacer with the text it has released.
 */
interface RecordedPacer {
  pacer: StreamPacer;
  released: string[];
}

/**
 * Create a pacer that records released text.
 * @returns pacer and released text
 */
function record(): RecordedPacer {
  const released: string[] = [];
  const pacer = createStreamPacer({
    onText: text => released.push(text),
    wordDelay: WORD_DELAY,
    maxLag: MAX_LAG,
  });

  return {
    pacer,
    released,
  };
}

describe('createStreamPacer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should release one word per delay', () => {
    const { pacer, released } = record();

    pacer.push('one two three ');
    vi.advanceTimersByTime(WORD_DELAY);

    expect(released).toEqual(['one ']);

    vi.advanceTimersByTime(WORD_DELAY * 2);

    expect(released).toEqual(['one ', 'two ', 'three ']);
  });

  it('should hold a word until it is complete', () => {
    const { pacer, released } = record();

    pacer.push('wor');
    vi.advanceTimersByTime(WORD_DELAY * 2);

    expect(released).toEqual([]);

    pacer.push('d ');
    vi.advanceTimersByTime(WORD_DELAY);

    expect(released).toEqual(['word ']);
  });

  it('should release a burst down to the lag limit in one update', () => {
    const { pacer, released } = record();
    const burst = 'word '.repeat(BURST_WORDS);

    pacer.push(burst);
    vi.advanceTimersByTime(WORD_DELAY);

    expect(released).toHaveLength(1);
    expect(released[0].split(/\s+/).filter(Boolean)).toHaveLength(BURST_WORDS - MAX_BACKLOG);

    vi.advanceTimersByTime(MAX_LAG - WORD_DELAY);

    expect(released.join('')).toBe(burst);
  });

  it('should release the rest once drained', async () => {
    const { pacer, released } = record();

    pacer.push('one tw');

    const drained = pacer.drain();

    await vi.advanceTimersByTimeAsync(WORD_DELAY * 2);
    await drained;

    expect(released.join('')).toBe('one tw');
  });

  it('should drop the rest once stopped', async () => {
    const { pacer, released } = record();

    pacer.push('one two ');

    const drained = pacer.drain();

    pacer.stop();
    await drained;
    vi.advanceTimersByTime(MAX_LAG);

    expect(released).toEqual([]);
  });
});
