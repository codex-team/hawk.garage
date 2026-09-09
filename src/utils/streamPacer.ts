/**
 * Milliseconds between words while the stream keeps up with the reader.
 */
const BASE_WORD_INTERVAL = 28;

/**
 * Shortest gap between words, used when a burst has to be worked off.
 */
const MIN_WORD_INTERVAL = 6;

/**
 * How long a backlog is given to clear. The gap between words shrinks with the
 * number of words waiting, so a burst is absorbed instead of queueing up behind
 * a fixed rate.
 */
const BACKLOG_DRAIN_TIME = 350;

/**
 * Credit is capped at a few words so a backgrounded tab, whose animation frames
 * stop arriving, does not come back and empty the buffer in one go.
 */
const MAX_CREDIT_WORDS = 4;

/**
 * Hands streamed text on one word at a time.
 */
export interface StreamPacer {
  /** Take text off the stream. */
  push(text: string): void;
  /** Stop expecting text and resolve once the rest has been handed on. */
  drain(): Promise<void>;
  /** Drop whatever is left and resolve a pending drain. */
  stop(): void;
}

/**
 * Settings for a stream pacer.
 */
export interface StreamPacerOptions {
  /** Receive the next word, with the whitespace that separates it from the last. */
  onText: (text: string) => void;
}

/**
 * Count the words still waiting to be handed on.
 * @param buffer - text taken off the stream but not yet released
 * @returns number of whitespace-separated words in the buffer
 */
function countWords(buffer: string): number {
  return (buffer.match(/\S+/g) || []).length;
}

/**
 * Release streamed text one word per tick instead of one chunk per network read.
 *
 * A model answers in bursts, and a burst that reaches the DOM whole puts a dozen
 * words on screen in the same frame, which reads as a block appearing rather than
 * an answer being written. Holding the text and letting go of a word at a time
 * spreads those words across frames, so each one starts its own animation.
 * @param options - where released words go
 * @returns pacer to feed the stream into
 */
export function createStreamPacer({ onText }: StreamPacerOptions): StreamPacer {
  // Text taken off the stream and not yet handed on.
  let buffer = '';
  // No more text is coming, so the last word need not wait for a separator.
  let closed = false;
  let frameRequest = 0;
  let lastFrameTime = 0;
  // Time owed to the buffer, spent one word at a time.
  let credit = 0;
  let resolveDrain: (() => void) | null = null;

  /**
   * Take the next word, along with the whitespace in front of it.
   *
   * While the stream is open a word without whitespace behind it may still grow,
   * so it stays in the buffer: releasing it would let the word animate and then
   * change under the reader.
   * @returns the word, or an empty string when none is ready
   */
  const takeWord = (): string => {
    const match = /^\s*\S+\s+/.exec(buffer);

    if (match) {
      buffer = buffer.slice(match[0].length);

      return match[0];
    }

    if (closed && buffer) {
      const rest = buffer;

      buffer = '';

      return rest;
    }

    return '';
  };

  const stopLoop = (): void => {
    if (frameRequest) {
      cancelAnimationFrame(frameRequest);
      frameRequest = 0;
    }
  };

  const settleDrain = (): void => {
    stopLoop();

    const resolve = resolveDrain;

    resolveDrain = null;
    resolve?.();
  };

  /**
   * Hand on as many words as the time since the last frame has paid for.
   * @param time - current frame timestamp
   */
  const tick = (time: number): void => {
    const interval = Math.min(
      BASE_WORD_INTERVAL,
      Math.max(MIN_WORD_INTERVAL, BACKLOG_DRAIN_TIME / Math.max(countWords(buffer), 1))
    );

    credit = Math.min(credit + (time - lastFrameTime), interval * MAX_CREDIT_WORDS);
    lastFrameTime = time;

    let released = '';

    while (credit >= interval) {
      const word = takeWord();

      if (!word) {
        credit = 0;

        break;
      }

      released += word;
      credit -= interval;
    }

    if (released) {
      onText(released);
    }

    if (closed && !buffer) {
      settleDrain();

      return;
    }

    frameRequest = requestAnimationFrame(tick);
  };

  const startLoop = (): void => {
    if (frameRequest) {
      return;
    }

    lastFrameTime = performance.now();
    // The first word is already late by the time the stream reaches the browser,
    // so it goes out on the next frame rather than waiting out an interval.
    credit = BASE_WORD_INTERVAL;
    frameRequest = requestAnimationFrame(tick);
  };

  return {
    push(text: string): void {
      if (closed) {
        return;
      }

      buffer += text;
      startLoop();
    },
    drain(): Promise<void> {
      closed = true;

      if (!buffer) {
        stopLoop();

        return Promise.resolve();
      }

      startLoop();

      return new Promise<void>((resolve) => {
        resolveDrain = resolve;
      });
    },
    stop(): void {
      closed = true;
      buffer = '';
      settleDrain();
    },
  };
}
