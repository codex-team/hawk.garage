/**
 * Time constants
 *
 * Commonly used time values in milliseconds and seconds
 */

/**
 * Base time constants
 */
const SIXTY = 60;
const TWENTY_FOUR = 24;
const ONE_THOUSAND = 1000;

/**
 * Time in milliseconds
 */
export const MILLISECONDS_IN_SECOND = ONE_THOUSAND;
export const MILLISECONDS_IN_MINUTE = SIXTY * MILLISECONDS_IN_SECOND;
export const MILLISECONDS_IN_HOUR = SIXTY * MILLISECONDS_IN_MINUTE;
export const MILLISECONDS_IN_DAY = TWENTY_FOUR * MILLISECONDS_IN_HOUR;

/**
 * Time in seconds
 */
export const SECONDS_IN_MINUTE = SIXTY;
export const SECONDS_IN_HOUR = SIXTY * SECONDS_IN_MINUTE;
export const SECONDS_IN_DAY = TWENTY_FOUR * SECONDS_IN_HOUR;

/**
 * Common day offsets
 */
export const ONE_DAY_AGO = 1;
export const TWO_DAYS_AGO = 2;
export const THREE_DAYS_AGO = 3;
export const FOUR_DAYS_AGO = 4;
export const FIVE_DAYS_AGO = 5;
export const SIX_DAYS_AGO = 6;
export const ONE_WEEK_AGO = 7;
export const TWO_WEEKS_AGO = 14;
export const THREE_WEEKS_AGO = 21;
