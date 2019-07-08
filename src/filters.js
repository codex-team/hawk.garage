import Vue from 'vue';

/**
 * Filter that add space after first digit in 4-digits number
 * @param {Number} value - filter value
 * @return {String} - filter result
 */
Vue.filter('spacedNumber', function (value) {
  if (typeof value !== 'number') return value;

  const count = value.toString();

  if (count.length === 4) return `${count.slice(0, 1)} ${count.slice(1)}`;
  return value;
});

/**
 * Return workspace name abbreviation (one or two symbols)
 * @return {string}
 */
Vue.filter('abbreviation', function (value) {
  const words = value.split(' ');

  return (words.length === 1 ? words[0][0] : words[0][0] + words[1][0]).toUpperCase();
});

/**
 * Return workspace name abbreviation (one or two symbols)
 * @return {string}
 */
Vue.filter('prettyDate', function (value) {
  const date = new Date(value);
  const currentDate = new Date();

  const ONE_MINUTE_IN_MS = 1000 * 60;

  if ((currentDate - date) / (ONE_MINUTE_IN_MS) < 1) return 'now';

  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${date.getHours()}:${formattedMinutes}`;
});
