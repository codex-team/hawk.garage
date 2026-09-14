/**
 * Delay between released words, in milliseconds.
 */
const WORD_DELAY = 30;

/**
 * Longest time released text may lag behind the stream, in milliseconds.
 */
const MAX_LAG = 1000;

/**
 * Complete word with the whitespace around it.
 */
const WORD = /^\s*\S+\s+/;

/**
 * Releases streamed text word by word at a steady pace.
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

  /**
   * Longest time released text may lag behind the stream, in milliseconds.
   */
  maxLag?: number;
}

/**
 * Create a pacer that releases streamed text word by word instead of in network bursts.
 * @param options - pacer settings
 * @returns pacer to push streamed text into
 */
export function createStreamPacer({ onText, wordDelay = WORD_DELAY, maxLag = MAX_LAG }: StreamPacerOptions): StreamPacer {
  const maxBacklog = Math.max(1, Math.floor(maxLag / wordDelay));
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
   * Release due words and schedule the next release.
   */
  const release = (): void => {
    const backlog = buffer.match(/\S+/g)?.length ?? 0;
    const count = Math.max(1, backlog - maxBacklog);
    let text = '';

    timer = undefined;

    for (let released = 0; released < count && hasWord(); released++) {
      text += takeWord();
    }

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
