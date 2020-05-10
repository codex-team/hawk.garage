import mergeWith from 'lodash.mergewith';

/**
 * Returns entity color from predefined list
 *
 * @param {string} [id] - for id-base picking colors (hex string)
 * @returns {string} color
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

  const decimalId = parseInt(id.substr(-1), 16); // take last id char and convert to decimal number system

  return colors[Math.floor(decimalId / 2)];
}

/**
 * Group array of Objects by key
 *
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
 *
 * @param {string} key - key for grouping
 */
export const groupBy =
  (key: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (array: any[]): object => // array of objects to group
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
 * Group array of object by 'date' field
 *
 * @type {(array: Array<object>) => object}
 */
export const groupByGroupingTimestamp = groupBy('groupingTimestamp');

/**
 * Returns real type of passed variable
 *
 * @param obj - what to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function typeOf(obj: any): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Object.prototype.toString.call(obj).match(/\s([a-zA-Z]+)/)![1].toLowerCase();
}

/**
 * Check if passed variable is an object
 *
 * @param item - what to check
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(item: any): boolean {
  return item && typeOf(item) === 'object';
}

/**
 * Merge to objects recursively
 *
 * @param {object} target - where to merge
 * @param {object[]} sources - what to merge
 * @returns {object}
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
 *
 * @param {string} string - string to transit
 * @returns {string}
 */
export function misTranslit(string: string): string {
  if (!string) {
    return '';
  }

  string = string.toLowerCase();

  /* eslint-disable quote-props */
  const map: { [key: string]: string } = {
    'q': 'й',
    'w': 'ц',
    'e': 'у',
    'r': 'к',
    't': 'е',
    'y': 'н',
    'u': 'г',
    'i': 'ш',
    'o': 'щ',
    'p': 'з',
    'a': 'ф',
    's': 'ы',
    'd': 'в',
    'f': 'а',
    'g': 'п',
    'h': 'р',
    'j': 'о',
    'k': 'л',
    'l': 'д',
    'z': 'я',
    'x': 'ч',
    'c': 'с',
    'v': 'м',
    'b': 'и',
    'n': 'т',
    'm': 'ь',
    'й': 'q',
    'ц': 'w',
    'у': 'e',
    'к': 'r',
    'е': 't',
    'н': 'y',
    'г': 'u',
    'ш': 'i',
    'щ': 'o',
    'з': 'p',
    'ф': 'a',
    'ы': 's',
    'в': 'd',
    'а': 'f',
    'п': 'g',
    'р': 'h',
    'о': 'j',
    'л': 'k',
    'д': 'l',
    'я': 'z',
    'ч': 'x',
    'с': 'c',
    'м': 'v',
    'и': 'b',
    'т': 'n',
    'ь': 'm',
    'ю': '.',
    'б': ',',
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
 *
 * @param {string} string - string to encode
 * @returns escaped string
 */
export function escape(string: string): string;

/**
 * Encodes HTML special characters (examples: &, <, >)
 *
 * @param {string} string - string to encode
 * @param {boolean} withCount - pass true if you need to know how many substitutions was
 *                              replaced and total length of new chars added
 * @returns object with escaped string, count and length
 */
export function escape(string: string, withCount: boolean): {value: string; count: number; length: number};

/**
 * Encodes HTML special characters (examples: &, <, >)
 *
 * @param {string} string - string to encode
 * @param {boolean} withCount - pass true if you need to know how many substitutions was
 *                              replaced and total length of new chars added
 * @returns {string | {value, count, length}} escaped string or object with escaped string, count and length
 */
export function escape(string: string, withCount = false): string | {value: string; count: number; length: number} {
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

  return !withCount ? replaced : {
    value: replaced,
    count,
    length,
  };
}

/**
 * Replace char at passed index to the new chars
 *
 * @param {string} string - source string
 * @param {number} index - char position
 * @param {string} replacement - charts to replace with
 *
 * @returns {string}
 */
export function strReplaceAt(string: string, index: number, replacement: string): string {
  const leftPart = string.substr(0, index);
  const rightPart = string.substr(index + 1);

  return leftPart + replacement + rightPart;
}

/**
 * Return real offset by line number and column number of string
 *
 * @param {string} string - where to find
 * @param {number} line - searching line number
 * @param {number} column - searching column number
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
