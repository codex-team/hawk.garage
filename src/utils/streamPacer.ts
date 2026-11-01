/**
 * Delay between released words, in milliseconds.
 */
const WORD_DELAY = 30;

/**
 * Complete word with the whitespace around it. Text without whitespace (including CJK text,
 * URLs and paths) stays buffered until whitespace arrives or the stream is drained.
 */
const WORD = /^\s*\S+\s+/;

/**
 * Releases streamed text one word per delay, including while draining.
 * A fast stream stays buffered until each word has had its turn.
 */
export interface StreamPacer {
  /**
   * Take text from the stream.
   */
  push(text: string): void;

  /**
   * Release the rest of the text.
   */
  drain(): Promise<void>;

  /**
   * Drop the rest of the text.
   */
  stop(): void;
}

/**
 * Stream pacer settings.
 */
export interface StreamPacerOptions {
  /**
   * Receive released text.
   */
  onText: (text: string) => void;

  /**
   * Delay between released words, in milliseconds.
   */
  wordDelay?: number;
}

/**
 * Create a pacer that releases streamed text word by word instead of in network bursts.
 * @param options - pacer settings
 * @returns pacer to push streamed text into
 */
export function createStreamPacer({ onText, wordDelay = WORD_DELAY }: StreamPacerOptions): StreamPacer {
  let buffer = '';
  let closed = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let resolveDrain: (() => void) | undefined;

  /**
   * Take the next complete word, or the rest of the text once the stream is closed.
   * @returns released text, or an empty string when nothing is ready
   */
  const takeWord = (): string => {
    const word = WORD.exec(buffer)?.[0] ?? (closed ? buffer : '');

    buffer = buffer.slice(word.length);

    return word;
  };

  /**
   * Check whether there is text to release.
   * @returns true when a word is ready
   */
  const hasWord = (): boolean => WORD.test(buffer) || (closed && buffer !== '');

  /**
   * Release one word and schedule the next release.
   */
  const release = (): void => {
    timer = undefined;
    const text = takeWord();

    if (text) {
      onText(text);
    }

    if (hasWord()) {
      timer = setTimeout(release, wordDelay);
    } else if (closed) {
      resolveDrain?.();
      resolveDrain = undefined;
    }
  };

  /**
   * Schedule a release unless one is already pending.
   */
  const schedule = (): void => {
    if (!timer && hasWord()) {
      timer = setTimeout(release, wordDelay);
    }
  };

  return {
    push(text: string): void {
      if (closed) {
        return;
      }

      buffer += text;
      schedule();
    },
    drain(): Promise<void> {
      closed = true;

      if (!buffer) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        resolveDrain = resolve;
        schedule();
      });
    },
    stop(): void {
      closed = true;
      buffer = '';
      clearTimeout(timer);
      timer = undefined;
      resolveDrain?.();
      resolveDrain = undefined;
    },
  };
}
