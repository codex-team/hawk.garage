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

// function for grouping by date
export const groupByDate = groupBy('date');
