import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamPacer, type StreamPacer } from './streamPacer';

/**
 * One pending animation frame.
 */
interface PendingFrame {
  /** Handle the pacer holds on to so it can cancel the frame. */
  id: number;
  /** What the pacer asked to run on the frame. */
  callback: FrameRequestCallback;
}

/**
 * A frame at 60Hz, the rate the pacer is written against.
 */
const FRAME = 16;

/**
 * How many frames a drain is given before the test gives up on it.
 */
const DRAIN_FRAME_LIMIT = 1000;

let now = 0;
let frames: PendingFrame[] = [];
let nextFrameId = 1;

/**
 * Run every frame that is waiting, after moving the clock forward.
 * @param step - milliseconds to move the clock by
 */
function advance(step: number): void {
  now += step;

  const due = frames;

  frames = [];
  due.forEach(({ callback }) => callback(now));
}

/**
 * Move through frames until a pacer has handed on everything it holds.
 * @param pacer - pacer to drain
 * @param step - milliseconds per frame
 */
async function drain(pacer: StreamPacer, step = FRAME): Promise<void> {
  const drained = pacer.drain();
  let settled = false;

  void drained.then(() => {
    settled = true;
  });

  for (let frame = 0; frame < DRAIN_FRAME_LIMIT && !settled; frame++) {
    advance(step);
    await Promise.resolve();
  }

  return drained;
}

beforeEach(() => {
  now = 0;
  frames = [];
  nextFrameId = 1;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback): number => {
    const id = nextFrameId++;

    frames.push({ id,
      callback });

    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number): void => {
    frames = frames.filter(frame => frame.id !== id);
  });
  vi.spyOn(performance, 'now').mockImplementation(() => now);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createStreamPacer', () => {
  it('spreads one delta across several frames', () => {
    const delta = 'one two three four five six seven eight ';
    const deltaWords = delta.trim().split(/\s+/).length;
    const released: string[] = [];
    const pacer = createStreamPacer({ onText: text => released.push(text) });

    pacer.push(delta);
    advance(FRAME);

    const afterFirstFrame = released.join('');

    expect(afterFirstFrame).not.toBe('');
    expect(afterFirstFrame.trim().split(/\s+/).length).toBeLessThan(deltaWords);

    advance(FRAME);
    expect(released.join('').length).toBeGreaterThan(afterFirstFrame.length);
  });

  it('holds back a word that is still arriving', () => {
    const released: string[] = [];
    const pacer = createStreamPacer({ onText: text => released.push(text) });

    pacer.push('alpha bet');
    advance(FRAME);
    advance(FRAME);
    advance(FRAME);

    expect(released.join('')).toBe('alpha ');

    pacer.push('a ');
    advance(FRAME);

    expect(released.join('')).toBe('alpha beta ');
  });

  it('hands on everything before a drain resolves', async () => {
    const released: string[] = [];
    const pacer = createStreamPacer({ onText: text => released.push(text) });

    pacer.push('one two three four five');
    await drain(pacer);

    expect(released.join('')).toBe('one two three four five');
  });

  it('works a backlog off faster than a trickle', () => {
    const countReleased = (text: string): number => (text.match(/\S+/g) || []).length;
    const busy: string[] = [];
    const calm: string[] = [];
    const words = (count: number): string => Array.from({ length: count }, (_, index) => `w${index}`).join(' ') + ' ';

    const backlogWords = 200;
    const trickleWords = 3;
    const busyPacer = createStreamPacer({ onText: text => busy.push(text) });

    busyPacer.push(words(backlogWords));
    advance(FRAME);

    const calmPacer = createStreamPacer({ onText: text => calm.push(text) });

    calmPacer.push(words(trickleWords));
    advance(FRAME);

    expect(countReleased(busy.join(''))).toBeGreaterThan(countReleased(calm.join('')));
  });

  it('gives up what is left when it is stopped', async () => {
    const released: string[] = [];
    const pacer = createStreamPacer({ onText: text => released.push(text) });

    pacer.push('one two three four five six seven eight nine ten ');
    advance(FRAME);

    const afterFirstFrame = released.join('');
    const drained = pacer.drain();

    pacer.stop();
    await expect(drained).resolves.toBeUndefined();

    advance(FRAME);
    expect(released.join('')).toBe(afterFirstFrame);
  });

  it('stops asking for frames once it has drained', async () => {
    const pacer = createStreamPacer({ onText: () => undefined });

    pacer.push('one two ');
    await drain(pacer);

    expect(frames).toHaveLength(0);
  });
});
