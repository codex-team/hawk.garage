/**
 * Valid UTM parameter keys
 */
const VALID_UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];

/**
 * Regular expression for valid UTM characters
 * Allows: alphanumeric, spaces, hyphens, underscores, dots
 */
const VALID_UTM_CHARACTERS = /^[a-zA-Z0-9\s\-_.]+$/;

/**
 * Regular expression for invalid UTM characters (inverse of VALID_UTM_CHARACTERS)
 * Used for cleaning/sanitizing values
 */
const INVALID_UTM_CHARACTERS = /[^a-zA-Z0-9\s\-_.]/g;

/**
 * Maximum allowed length for UTM parameter values
 */
const MAX_UTM_VALUE_LENGTH = 200;

/**
 * Validates UTM parameters object
 * @param {Object} utm - UTM parameters to validate
 * @returns {boolean} - true if valid, false if invalid
 */
export function validateUtmParams(utm: any): boolean {
  if (!utm) {
    return true;
  }

  // Check if utm is an object
  if (typeof utm !== 'object' || Array.isArray(utm)) {
    return false;
  }

  const providedKeys = Object.keys(utm);

  // Check if utm object is not empty
  if (providedKeys.length === 0) {
    return true; // Empty object is valid
  }

  // Check if all provided keys are valid UTM keys
  const hasInvalidKeys = providedKeys.some((key) => !VALID_UTM_KEYS.includes(key));
  if (hasInvalidKeys) {
    return false;
  }

  // Check if values are strings and not too long
  for (const [key, value] of Object.entries(utm)) {
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string') {
        return false;
      }

      // Check length
      if (value.length === 0 || value.length > MAX_UTM_VALUE_LENGTH) {
        return false;
      }

      // Check for valid characters - only allow alphanumeric, spaces, hyphens, underscores, dots
      if (!VALID_UTM_CHARACTERS.test(value)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Sanitizes UTM parameters by removing invalid characters
 * @param {Object} utm - UTM parameters to sanitize
 * @returns {Object|undefined} - sanitized UTM parameters or undefined if invalid
 */
export function sanitizeUtmParams(utm: any): Record<string, string> | undefined {
  if (!utm) {
    return undefined;
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(utm)) {
    if (VALID_UTM_KEYS.includes(key) && value && typeof value === 'string') {
      // Sanitize value: keep only allowed characters and limit length
      const cleanValue = value
        .replace(INVALID_UTM_CHARACTERS, '')
        .trim()
        .substring(0, MAX_UTM_VALUE_LENGTH);

      if (cleanValue.length > 0) {
        sanitized[key] = cleanValue;
      }
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/**
 * Validates and sanitizes UTM parameters in one call
 * @param {Object} utm - UTM parameters to process
 * @returns {Object|undefined} - sanitized UTM parameters or undefined if invalid
 */
export function processUtmParams(utm: any): Record<string, string> | undefined {
  if (!validateUtmParams(utm)) {
    return undefined;
  }

  return sanitizeUtmParams(utm);
}
