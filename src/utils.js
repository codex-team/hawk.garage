/**
 * Returns entity color from predefined list
 * @param {String} [id] - for id-base picking colors (hex string)
 * @return {String} color
 */
export function getEntityColor(id) {
  const colors = [
    '#15c46d',
    '#36a9e0',
    '#ef4b4b',
    '#4ec520',
    '#b142af',
    '#6632b8',
    '#3251b8',
    '#505b74'
  ];

  if (!id) return colors[Math.floor(Math.random() * colors.length)];

  const decimalId = parseInt(id.substr(-1), 16); // take last id char and convert to decimal number system

  return colors[Math.floor(decimalId / 2)];
}

/**
 * Group array of Objects by key
 * @usage
 *
 * const cars = [
 * { brand: 'Audi', color: 'black' },
 * { brand: 'Audi', color: 'white' },
 * { brand: 'Ferarri', color: 'red' },
 * { brand: 'Ford', color: 'white' },
 * { brand: 'Peugot', color: 'white' }
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
 * @param {String} key - key for grouping
 */
export const groupBy =
  key =>
    array => // array of objects to group
      array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];

        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {});

/**
 * Group array of object by 'date' field
 * @type {function(Array[Object]): Object}
 */
export const groupByDate = groupBy('date');

/**
 * Converts string in wrong language to the translited equal
 * @param {string} string
 * @return {String}
 */
export function misTranslit(string) {
  string = string.toLowerCase();

  /* eslint-disable quote-props */
  const map = {
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
    ' ': ' '
  };

  let newString = '';

  for (let i = 0, lenCached = string.length; i < lenCached; i++) {
    newString += map[string[i]];
  }

  return newString;
}
