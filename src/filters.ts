import Vue from 'vue';
import i18n from './i18n';
import shortNumber from 'short-number';

/**
 * Filter that add space after first digit in 4-digits number
 * @param value - filter value
 */
Vue.filter('spacedNumber', function (value: number): string {
  const count = value.toString();

  if (count.length < 3) {
    return count;
  }

  let result = '';

  for (let i = 1; i <= Math.ceil(count.length / 3); i++) {
    result = `${count.slice(-3 * i, -3 * (i - 1) || undefined)} ` + result;
  }

  return result.trim();
});

/**
 * Filter that abbreviates numbers
 * @param value - filter value
 */
Vue.filter('abbreviateNumber', function (value: number): string {
  const maxNumberWithoutAbbreviation = 9999;

  if (value < maxNumberWithoutAbbreviation) {
    return value.toString();
  }

  return shortNumber(value);
});

/**
 * Return workspace name abbreviation (one or two symbols)
 * @return {string}
 */
Vue.filter('abbreviation', function (value: string): string {
  if (!value) {
    return '';
  }

  const words = value.split(' ');

  return (words.length === 1 ? words[0][0] : words[0][0] + words[1][0]).toUpperCase();
});

/**
 * Returns prettifying time ('now' or time in hh:mm)
 * @return {string}
 */
Vue.filter('prettyTime', function (value: Date | string) {
  const date = new Date(value);
  const currentDate = new Date();

  const ONE_MINUTE_IN_MS = 1000 * 60;

  if ((currentDate.getTime() - date.getTime()) / (ONE_MINUTE_IN_MS) < 1) {
    return 'now';
  }

  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${date.getHours()}:${formattedMinutes}`;
});

/**
 * Returns prettifying date ('Today', 'Yesterday' or time like '7 may')
 */
Vue.filter('prettyDateStr', function (value: string): string {
  const [day, month]: number[] = value.split('-').map(stringValue => +stringValue);

  const currentDate = new Date().getDate();

  if (+day === currentDate) {
    return 'Today';
  }

  if (+day === currentDate - 1) {
    return 'Yesterday';
  }

  return `${day} ${i18n.t('common.months[' + (month - 1) + ']')}`;
});

/**
 * Returns prettified date from string
 *
 * @return {string}
 */
Vue.filter('prettyDate', function (value: Date | string) {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth();
  const currentDate = new Date().getDate();

  if (+day === currentDate) {
    return 'Today';
  }

  if (+day === currentDate - 1) {
    return 'Yesterday';
  }

  return `${day} ${i18n.t('common.months[' + month + ']')} ${date.getFullYear()}`;
});

/**
 * Returns prettified date ('29 aug, 14:30')
 * @returns {string}
 */
Vue.filter('prettyFullDate', function (value: Date) {
  const day = value.getDate();
  const month = value.getMonth();
  const hours = value.getHours();
  const minutes = value.getMinutes();

  return `${day} ${i18n.t(`common.shortMonths[${month}]`)}, ${`0${hours}`.substr(-2)}:${`0${minutes}`.substr(-2)}`;
});
