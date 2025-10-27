import { i18n } from '../i18n';
import { capitalize, pad, trim } from '../utils';

/**
 * Filter that add space after first digit in 4-digits number
 *
 * @param value - filter value
 */
export function spacedNumber(value: number): string {
  const count = value.toString();
  const thousandRank = 3;
  const negativeThousandRank = -3;

  if (count.length < thousandRank) {
    return count;
  }

  let result = '';

  for (let i = 1; i <= Math.ceil(count.length / thousandRank); i++) {
    result = `${count.slice(negativeThousandRank * i, negativeThousandRank * (i - 1) || undefined)} ` + result;
  }

  return result.trim();
}

/**
 * Return workspace name abbreviation (one or two symbols)
 *
 * @returns {string}
 */
export function abbreviation(value: string): string {
  if (!value) {
    return '';
  }

  const words = value.split(' ').filter(word => word.length > 0);

  return (
    words.length === 1 ? words[0][0] : words[0][0] + words[1][0]
  ).toUpperCase();
}

/**
 * Returns prettifying time ('now' or time in hh:mm)
 *
 * @returns {string}
 */
export function prettyTime(value: number): string {
  const MS_PER_SECOND = 1000;
  const SECONDS_PER_MINUTE = 60;
  const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
  const date = new Date(value * MS_PER_SECOND);
  const currentDate = new Date();

  if ((currentDate.getTime() - date.getTime()) / (MS_PER_MINUTE) < 1) {
    return 'now';
  }

  const minutes = date.getMinutes();
  const formattedMinutes = pad(minutes);

  return `${date.getHours()}:${formattedMinutes}`;
}

/**
 * Returns prettifying date ('Today', 'Yesterday' or time like '7 may')
 *
 * @returns {string}
 */
export function prettyDateStr(value: string): string {
  const [day, month]: number[] = value
    .split('-')
    .map((stringValue) => +stringValue);

  const currentDate = new Date().getDate();

  if (+day === currentDate) {
    return i18n.t('common.today').toString();
  }

  if (+day === currentDate - 1) {
    return i18n.t('common.yesterday').toString();
  }

  return `${day} ${i18n.t('common.months[' + (month - 1) + ']')}`;
}

/**
 * Returns prettified date from string
 *
 * @returns {string}
 */
export function prettyDate(value: number): string {
  const MS_PER_SECOND = 1000;
  const argumentDate = new Date(value * MS_PER_SECOND);
  const argumentDay = argumentDate.getDate();
  const argumentMonth = argumentDate.getMonth();
  const argumentYear = argumentDate.getFullYear();
  const currentDate = new Date();

  if (
    argumentDay === currentDate.getDate() &&
    argumentMonth === currentDate.getMonth() &&
    argumentYear === currentDate.getFullYear()
  ) {
    return i18n.t('common.today').toString();
  }

  if (
    argumentDay === currentDate.getDate() - 1 &&
    argumentMonth === currentDate.getMonth() &&
    argumentYear === currentDate.getFullYear()
  ) {
    return i18n.t('common.yesterday').toString();
  }

  return `${argumentDay} ${i18n.t('common.months[' + argumentMonth + ']')} ${argumentYear}`;
}

/**
 * Returns prettified date ('29 aug, 14:30')
 *
 * @returns {string}
 */
export function prettyFullDate(value: number): string {
  const MS_PER_SECOND = 1000;
  const date = new Date(value * MS_PER_SECOND);

  const day = date.getDate();
  const month = date.getMonth();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day} ${i18n.t(`common.shortMonths[${month}]`)}, ${pad(hours)}:${pad(minutes)}`;
}

/**
 * Returns prettifying date from timestamp
 *
 * @param {number} timestamp - timestamp
 */
export function prettyDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth();

  return `${day} ${i18n.t('common.shortMonths[' + month + ']')}`;
}

/**
 * Accepts GraphQL DateTime string like '1992-10-09T00:00:00Z'
 * Return string like '2020, Oct 9 00:00'
 *
 * @param dateStr - string like '1992-10-09T00:00:00Z'
 * @param includeTime - pass true to include time to the result
 */
export function prettyDateFromDateTimeString(dateStr: string, includeTime = true): string {
  const date = new Date(dateStr);
  const now = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const isSameYear = now.getFullYear() === year;
  const monthStr = capitalize(
    i18n.global.t('common.shortMonths[' + month + ']').toString()
  );

  let result = `${isSameYear ? '' : year + ', '}${monthStr} ${day}`;

  if (includeTime) {
    result += ` ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return result;
}

/**
 * Convert US cents to dollars
 *
 * @returns {string}
 */
export function centsToDollars(value: number): number {
  const CENTS_PER_DOLLAR = 100;

  return value / CENTS_PER_DOLLAR;
}

/**
 * Converts relative time into pretty string like '2021-05-20T15:40:51.000+00:00'.
 * Returns string like 'hours ago'.
 *
 * @param {string} date - date in string formate
 * @returns {string} relative time from today
 */
export function prettyRelativeTimeStr(date: string): string {
  const MS_PER_SECOND = 1000;
  const SECONDS_PER_YEAR = 31536000;
  const SECONDS_PER_MONTH = 2592000;
  const SECONDS_PER_DAYS = 86400;
  const SECONDS_PER_HOURS = 3600;
  const SECONDS_PER_MINUTE = 60;
  const currentTime = new Date();
  const commitTime = new Date(date);
  const diffInSeconds =
    Math.abs(currentTime.valueOf() - commitTime.valueOf()) / MS_PER_SECOND;

  const numberOfYears = Math.floor(diffInSeconds / SECONDS_PER_YEAR);

  if (numberOfYears) {
    return i18n.tc('common.relativeTime.yearsAgo', numberOfYears, { numberOfYears: numberOfYears });
  }

  const numberOfMonths = Math.floor(diffInSeconds / SECONDS_PER_MONTH);

  if (numberOfMonths) {
    return i18n.tc('common.relativeTime.monthsAgo', numberOfMonths, { numberOfMonths: numberOfMonths });
  }

  const numberOfDays = Math.floor(diffInSeconds / SECONDS_PER_DAYS);

  if (numberOfDays) {
    return i18n.tc('common.relativeTime.daysAgo', numberOfDays, { numberOfDays: numberOfDays });
  }

  const numberOfHours = Math.floor(diffInSeconds / SECONDS_PER_HOURS);

  if (numberOfHours) {
    return i18n.tc('common.relativeTime.hoursAgo', numberOfHours, { numberOfHours: numberOfHours });
  }

  const numberOfMinutes = Math.floor(diffInSeconds / SECONDS_PER_MINUTE);

  if (numberOfMinutes) {
    return i18n.tc('common.relativeTime.minutesAgo', numberOfMinutes, { numberOfMinutes: numberOfMinutes });
  }

  return i18n.t('common.relativeTime.secondsAgo').toString();
}

/**
 * Trims the string to max length and add ellipsis
 *
 * @returns {string}
 */
export function trimString(value: string, maxLen: number): string {
  return trim(value, maxLen);
}
