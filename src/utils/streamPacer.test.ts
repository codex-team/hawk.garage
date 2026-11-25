/* eslint-disable @typescript-eslint/no-magic-numbers -- Explicit word counts and timer steps describe the pacing contract. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamPacer, type StreamPacer } from './streamPacer';

/**
 * Delay between words in tests, in milliseconds.
 */
const WORD_DELAY = 30;

/**
 * More words than a second of pacing can display.
 */
const BURST_WORDS = 100;

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

  it('should keep a large burst at one word per delay', () => {
    const { pacer, released } = record();
    const burst = 'word '.repeat(BURST_WORDS);

    pacer.push(burst);
    vi.advanceTimersByTime(WORD_DELAY);

    expect(released).toEqual(['word ']);

    vi.advanceTimersByTime(WORD_DELAY * (BURST_WORDS - 1));

    expect(released).toEqual(Array<string>(BURST_WORDS).fill('word '));
  });

  it('should keep the same pace while draining a large burst', async () => {
    const { pacer, released } = record();

    pacer.push('word '.repeat(BURST_WORDS));
    const drained = pacer.drain();

    await vi.advanceTimersByTimeAsync(WORD_DELAY);

    expect(released).toEqual(['word ']);

    await vi.runAllTimersAsync();
    await drained;

    expect(released).toEqual(Array<string>(BURST_WORDS).fill('word '));
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
    vi.runAllTimers();

    expect(released).toEqual([]);
  });

  it('should ignore text pushed after stop', () => {
    const { pacer, released } = record();

    pacer.stop();
    pacer.push('ignored words ');
    vi.runAllTimers();

    expect(released).toEqual([]);
  });

  it('should ignore text pushed after drain starts', async () => {
    const { pacer, released } = record();

    pacer.push('one');
    const drained = pacer.drain();

    pacer.push(' ignored');
    await vi.runAllTimersAsync();
    await drained;

    expect(released.join('')).toBe('one');
  });

  it('should hold a trailing incomplete word after releasing a burst', () => {
    const { pacer, released } = record();

    pacer.push('word '.repeat(BURST_WORDS) + 'unfinished');
    vi.runAllTimers();

    expect(released).toEqual(Array<string>(BURST_WORDS).fill('word '));

    pacer.push(' ');
    vi.advanceTimersByTime(WORD_DELAY);

    expect(released[released.length - 1]).toBe('unfinished ');
  });

  it('should keep the same pace when another burst arrives', () => {
    const { pacer, released } = record();

    pacer.push('first '.repeat(30));
    vi.advanceTimersByTime(WORD_DELAY);
    expect(released).toEqual(['first ']);

    pacer.push('second '.repeat(20));
    vi.advanceTimersByTime(WORD_DELAY);
    expect(released).toEqual(['first ', 'first ']);

    vi.runAllTimers();
    expect(released).toEqual([
      ...Array<string>(30).fill('first '),
      ...Array<string>(20).fill('second '),
    ]);
  });
});
