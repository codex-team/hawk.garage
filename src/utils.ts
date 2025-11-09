import mergeWith from 'lodash.mergewith';
import type { HawkEvent, HawkEventDailyInfo } from './types/events';
import type { DecodedIntegrationToken } from '@hawk.so/types';

/**
 * @param currency
 */
export function getCurrencySign(currency: string): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'RUB':
      return '₽';
    default:
      return '';
  }
}

/**
 * Returns entity color from predefined list
 * @param [id] - for id-base picking colors (hex string)
 * @returns color
 */
export function getEntityColor(id: string): string {
  const colors = [
    '#15c46d',
    '#36a9e0',
    '#ef4b4b',
    '#4ec520',
    '#b142af',
    '#6632b8',
    '#3251b8',
    '#505b74',
  ];

  if (!id) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const hexRadix = 16;
  const decimalId = parseInt(id.substr(-1), hexRadix); // take last id char and convert to decimal number system
  const colorsToRadix = hexRadix / colors.length;

  return colors[Math.floor(decimalId / colorsToRadix)];
}

/**
 * Group array of Objects by key
 * @example
 *
 * const cars = [
 * { brand: 'Audi', color: 'black' },
 * { brand: 'Audi', color: 'white' },
 * { brand: 'Ferrari', color: 'red' },
 * { brand: 'Ford', color: 'white' },
 * { brand: 'Peugeot', color: 'white' }
 * ];
 *
 * const groupByBrand = groupBy('brand');
 * const groupByColor = groupBy('color');
 *
 * console.log(
 *   JSON.stringify({
 *     carsByBrand: groupByBrand(cars),
 *     carsByColor: groupByColor(cars)
 *   }, null, 2)
 * );
 * @param key - key for grouping
 */
export const groupBy
  = (key: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (array: any[]): Record<string, unknown> => // array of objects to group
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];

        /**
         * Case when we need to group by field that stored numbers,
         * for example, date(timestamp) - we add "key:" prefix to prevent sorting of object keys
         */
        let groupingKey = key;

        if (typeof value === 'number') {
          groupingKey = key + ':' + value;
        }

        objectsByKeyValue[groupingKey] = (objectsByKeyValue[groupingKey] || []).concat(obj);

        return objectsByKeyValue;
      }, {});

/**
 * Converts UTC midnight timestamp to local midnight timestamp
 * @param utcMidnight - midnight in UTC
 * @returns midnight in local timezone
 */
function convertUtcMidnightToLocalMidnight(utcMidnight: number): number {
  const milliseconds = 1000;
  const hour = 60;
  const date = new Date(utcMidnight * milliseconds);
  const timezoneOffset = date.getTimezoneOffset() / hour * -1;

  date.setHours(timezoneOffset, 0, 0, 0);

  return date.getTime() / milliseconds;
}

/**
 * Group array of object by 'groupingTimestamp' field
 *
 * /!\ The  'groupingTimestamp' field is stored in UTC so we need to convert it to the local zone first.
 * @param items - array of object with the  'groupingTimestamp' field
 * @param [convertMidnight] - need to convert utc midnight to local
 */
export function groupByGroupingTimestamp(items: object[], convertMidnight = true): Record<string, unknown> {
  if (!convertMidnight) {
    return groupBy('groupingTimestamp')(items);
  }

  items = items.map((item) => {
    return Object.assign({}, item, {
      groupingTimestamp: convertUtcMidnightToLocalMidnight((item as HawkEventDailyInfo).groupingTimestamp),
    });
  });

  return groupBy('groupingTimestamp')(items);
}

/**
 * Returns real type of passed variable
 * @param obj - what to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function typeOf(obj: any): string {
  return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)![1].toLowerCase();
}

/**
 * Check if passed variable is an object
 * @param item - what to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(item: any): boolean {
  return item && typeOf(item) === 'object';
}

/**
 * Merge to objects recursively
 * @param target - where to merge
 * @param sources - what to merge
 * @returns
 */
export function deepMerge(target: object, ...sources: object[]): object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mergeWith({}, target, ...sources, function (_subject: any, _target: any) {
    if (Array.isArray(_subject) && Array.isArray(_target)) {
      const biggerArray = _subject.length > _target.length ? _subject : _target;
      const lesser = _subject.length > _target.length ? _target : _subject;

      return biggerArray.map((el, i) => {
        if (isObject(el) && isObject(lesser[i])) {
          return mergeWith({}, el, lesser[i]);
        } else {
          return el;
        }
      });
    }
  });
}

/**
 * Converts string in wrong language to the translited equal
 * @param string - string to transit
 * @returns
 */
export function misTranslit(string: string): string {
  if (!string) {
    return '';
  }

  string = string.toLowerCase();

  const map: { [key: string]: string } = {
    q: 'й',
    w: 'ц',
    e: 'у',
    r: 'к',
    t: 'е',
    y: 'н',
    u: 'г',
    i: 'ш',
    o: 'щ',
    p: 'з',
    a: 'ф',
    s: 'ы',
    d: 'в',
    f: 'а',
    g: 'п',
    h: 'р',
    j: 'о',
    k: 'л',
    l: 'д',
    z: 'я',
    x: 'ч',
    c: 'с',
    v: 'м',
    b: 'и',
    n: 'т',
    m: 'ь',
    й: 'q',
    ц: 'w',
    у: 'e',
    к: 'r',
    е: 't',
    н: 'y',
    г: 'u',
    ш: 'i',
    щ: 'o',
    з: 'p',
    ф: 'a',
    ы: 's',
    в: 'd',
    а: 'f',
    п: 'g',
    р: 'h',
    о: 'j',
    л: 'k',
    д: 'l',
    я: 'z',
    ч: 'x',
    с: 'c',
    м: 'v',
    и: 'b',
    т: 'n',
    ь: 'm',
    ю: '.',
    б: ',',
    ' ': ' ',
  };

  let newString = '';

  for (let i = 0, lenCached = string.length; i < lenCached; i++) {
    newString += map[string[i]];
  }

  return newString;
}

/**
 * Encodes HTML special characters (examples: &, <, >)
 * @param string - string to encode
 * @returns escaped string
 */
export function escape(string: string): string;

/**
 * Encodes HTML special characters (examples: &, <, >)
 * @param string - string to encode
 * @param withCount - pass true if you need to know how many substitutions was
 *                              replaced and total length of new chars added
 * @returns object with escaped string, count and length
 */
export function escape(string: string, withCount: boolean): { value: string;
  count: number;
  length: number; };

/**
 * Encodes HTML special characters (examples: &, <, >)
 * @param string - string to encode
 * @param withCount - pass true if you need to know how many substitutions was
 *                              replaced and total length of new chars added
 * @returns escaped string or object with escaped string, count and length
 */
export function escape(string: string, withCount = false): string | { value: string;
  count: number;
  length: number; } {
  if (!string) {
    return '';
  }

  let count = 0;
  let length = 0;

  const dictionary = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&#39;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
  ];

  const replaced = dictionary.reduce((accumulator, pair) => {
    const [regex, replaceWith] = pair as [RegExp, string];

    return accumulator.replace(regex, () => {
      count++;
      length += replaceWith.length - 1; // 1 is original symbol's length (in regexp)

      return replaceWith;
    });
  }, string);

  return !withCount
    ? replaced
    : {
        value: replaced,
        count,
        length,
      };
}

/**
 * Replace char at passed index to the new chars
 * @param string - source string
 * @param index - char position
 * @param replacement - charts to replace with
 * @returns
 */
export function strReplaceAt(string: string, index: number, replacement: string): string {
  const leftPart = string.substr(0, index);
  const rightPart = string.substr(index + 1);

  return leftPart + replacement + rightPart;
}

/**
 * Return real offset by line number and column number of string
 * @param string - where to find
 * @param line - searching line number
 * @param column - searching column number
 * @returns
 */
export function findOffsetByLineAndCol(string: string, line: number, column: number): number {
  let currentLine = 0;
  let position = 0;
  let offset = 0;

  for (let i = 0, lenCached = string.length; i < lenCached; i++) {
    if (string[i] === '\n') {
      currentLine++;
      position = 0;
    } else {
      position++;
    }

    if (currentLine === line && position === column) {
      offset = i + 1;
      break;
    }
  }

  return offset;
}

/**
 * Debounce function in order to
 * time-consuming tasks don't run so often
 * @param callback - function for debounce
 * @param delay - debounce delay
 * @returns
 */
export function debounce(callback: () => void, delay: number): () => void {
  let debounceTimer;

  return function (...args): void {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      callback.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle function to limit the rate at which a function can be called.
 * Executes the callback immediately, then waits for the delay period before
 * allowing the next execution.
 *
 * @param {Function} callback - function to throttle
 * @param {number} delay - throttle delay in milliseconds
 *
 * @returns {Function}
 */
export function throttle(callback: () => void, delay: number): () => void {
  let lastExecTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args): void {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    if (timeSinceLastExec >= delay) {
      /* Execute immediately if enough time has passed */
      lastExecTime = currentTime;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      callback.apply(this, args);
    } else {
      /* Schedule execution for the remaining time */
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      const remainingTime = delay - timeSinceLastExec;

      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        callback.apply(this, args);
        timeoutId = null;
      }, remainingTime);
    }
  };
}

/**
 * Uppercase the first letter
 * @param string - string to process
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Add 0 to digit to get string like '09' or '-09'
 * @param number - digit to process
 * @param length - how many chars should be (2 for '09', 3 for '009' etc)
 */
export function pad(number: number, length = 2): string {
  const abs = Math.abs(number);
  const numberLen = abs.toString().length;

  if (numberLen >= length) {
    return number.toString();
  }

  const sign = number < 0 ? '–' : '';

  return sign + Array(length - numberLen + 1).join('0') + abs;
}

/**
 * Some addons have their beautified versions added on backend processing
 * — if so, show them instead of originals
 * @param repetitions
 * @see https://github.com/codex-team/hawk.garage/issues/436
 */
export function filterBeautifiedAddons(repetitions: HawkEvent[]): void {
  const addonsBeautified = {
    userAgent: 'beautifiedUserAgent',
  };

  repetitions.forEach((repetition) => {
    Object.entries(addonsBeautified).forEach(([addonToRemove, _]) => {
      if (repetition.payload.addons && repetition.payload.addons[addonToRemove]) {
        delete repetition.payload.addons[addonToRemove];
      }
    });
  });
}

/**
 * Trims the string
 * @param value - what to trim
 * @param maxLen - how many chars to leave
 */
export function trim(value: string, maxLen: number): string {
  return value.length > maxLen ? value.substring(0, maxLen - 1) + '…' : value.substring(0, maxLen);
}

/**
 * Decode Hawk integration token
 * @param token - stringified integration token
 */
function decodeIntegrationToken(token: string): DecodedIntegrationToken {
  return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
}

/**
 * Sentry DSN should follow this:
 * const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
 * https://github.com/getsentry/sentry-javascript/blob/d773cb7324480ed3cffc14504f0e41951e344d19/packages/core/src/utils-hoist/dsn.ts#L7
 *
 * So we can't use our integration token as is.
 * Instead, we will concatinate integrationId and secret and remove hyphens from their uuids.
 * @param token - stringified integration token
 */
function getHexIntegrationToken(token: string): string {
  const { integrationId, secret } = decodeIntegrationToken(token);

  const removeHyphens = (str: string): string => str.replace(/-/g, '');

  return `${removeHyphens(integrationId)}${removeHyphens(secret)}`;
}

/**
 * Returns Sentry DSN from integration token
 * @param token - stringified integration token
 */
export function getSentryDSN(token: string): string {
  try {
    return `https://${getHexIntegrationToken(token)}@k1.hawk.so/0`;
  } catch (e) {
    return '';
  }
}

/**
 * Returns platform name
 * @returns
 */
export function getPlatform(): 'macos' | 'windows' | 'linux' {
  if (navigator.userAgent.includes('Mac')) {
    return 'macos';
  }

  if (navigator.userAgent.includes('Win')) {
    return 'windows';
  }

  return 'linux';
}
