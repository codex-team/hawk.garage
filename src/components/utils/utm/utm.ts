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
 * Validates UTM parameters per key
 * @param {Object} utm - UTM parameters to validate
 * @returns {Object} - validation results with valid/invalid keys
 */
export function validateUtmParams(
  utm: any
): {
  isValid: boolean;
  validKeys: string[];
  invalidKeys: string[];
} {
  if (!utm) {
    return { isValid: true, validKeys: [], invalidKeys: [] };
  }

  // Check if utm is an object
  if (typeof utm !== 'object' || Array.isArray(utm)) {
    return { isValid: false, validKeys: [], invalidKeys: ['_structure'] };
  }

  const providedKeys = Object.keys(utm);

  // Check if utm object is not empty
  if (providedKeys.length === 0) {
    return { isValid: true, validKeys: [], invalidKeys: [] };
  }

  const validKeys: string[] = [];
  const invalidKeys: string[] = [];

  for (const [key, value] of Object.entries(utm)) {
    // Check if key is valid UTM key
    if (!VALID_UTM_KEYS.includes(key)) {
      invalidKeys.push(key);
      continue;
    }

    // Check if value is valid
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string') {
        invalidKeys.push(key);
        continue;
      }

      // Check length
      if (value.length === 0 || value.length > MAX_UTM_VALUE_LENGTH) {
        invalidKeys.push(key);
        continue;
      }

      // Check for valid characters
      if (!VALID_UTM_CHARACTERS.test(value)) {
        invalidKeys.push(key);
        continue;
      }
    }

    validKeys.push(key);
  }

  return {
    isValid: invalidKeys.length === 0,
    validKeys,
    invalidKeys,
  };
}

/**
 * Sanitizes UTM parameters by keeping only valid keys and cleaning values
 * @param {Object} utm - UTM parameters to sanitize
 * @param {Object} validationResult - Optional validation result to use valid keys from
 * @returns {Object|undefined} - sanitized UTM parameters or undefined if no valid data
 */
export function sanitizeUtmParams(
  utm: any,
  validationResult?: { validKeys: string[]; invalidKeys: string[] }
): Record<string, string> | undefined {
  if (!utm) {
    return undefined;
  }

  const sanitized = {};

  // Use validation result if provided, otherwise validate inline
  const keysToProcess = validationResult
    ? validationResult.validKeys
    : Object.keys(utm).filter((key) => VALID_UTM_KEYS.includes(key));

  for (const key of keysToProcess) {
    const value = utm[key];

    if (value && typeof value === 'string') {
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
 * @returns {Object|undefined} - sanitized UTM parameters or undefined if no valid data
 */
export function processUtmParams(utm: any): Record<string, string> | undefined {
  const validationResult = validateUtmParams(utm);

  if (validationResult.validKeys.length === 0) {
    return undefined;
  }

  return sanitizeUtmParams(utm, validationResult);
}
