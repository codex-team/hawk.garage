/**
 * Valid UTM parameter keys
 */
const VALID_UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];

/**
 * Local storage key used to keep attribution across sessions and redirects
 */
export const UTM_STORAGE_KEY = 'hawk.utm';

type UtmParams = Record<string, string>;
type UtmQueryValue = string | (string | null)[] | null | undefined;
type UtmQuery = Record<string, UtmQueryValue>;
type UtmStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Regular expression for valid UTM characters
 * Allows: alphanumeric, spaces, hyphens, underscores, dots
 */
const VALID_UTM_CHARACTERS = /^[a-zA-Z0-9\s\-_.]+$/;

/**
 * Maximum allowed length for UTM parameter values
 */
const MAX_UTM_VALUE_LENGTH = 50;

/**
 * Validates and filters UTM parameters
 * @param utm - UTM parameters to validate
 * @returns - filtered valid UTM parameters
 */
export function validateUtmParams(utm: unknown): UtmParams | undefined {
  if (!utm || typeof utm !== 'object' || Array.isArray(utm)) {
    return undefined;
  }

  const result: UtmParams = {};

  for (const [key, value] of Object.entries(utm)) {
    // 1) Remove keys that are not VALID_UTM_KEYS
    if (!VALID_UTM_KEYS.includes(key)) {
      continue;
    }

    // 2) Check each condition separately
    if (!value || typeof value !== 'string') {
      continue;
    }

    if (value.length === 0 || value.length > MAX_UTM_VALUE_LENGTH) {
      continue;
    }

    if (!VALID_UTM_CHARACTERS.test(value)) {
      continue;
    }

    result[key] = value;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Returns browser local storage when it is available
 */
function getBrowserStorage(): UtmStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Normalizes a Vue Router query value to a single string
 * @param value - route query value
 */
function normalizeQueryValue(value: UtmQueryValue): string | undefined {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === 'string');
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * Extracts validated UTM parameters from a Vue Router query
 * @param query - route query
 */
export function extractUtmParams(query: UtmQuery): UtmParams | undefined {
  const utm: UtmParams = {};

  VALID_UTM_KEYS.forEach((key) => {
    const value = normalizeQueryValue(query[`utm_${key}`]);

    if (value !== undefined) {
      utm[key] = value;
    }
  });

  return validateUtmParams(utm);
}

/**
 * Reads validated UTM attribution persisted in local storage
 * @param storage - storage implementation
 */
export function readStoredUtmParams(
  storage: UtmStorage | undefined = getBrowserStorage()
): UtmParams | undefined {
  if (!storage) {
    return undefined;
  }

  try {
    const storedValue = storage.getItem(UTM_STORAGE_KEY);

    return storedValue ? validateUtmParams(JSON.parse(storedValue)) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolves latest attribution from URL or persisted storage
 * Explicit valid URL parameters replace the previous attribution snapshot
 * @param query - current route query
 * @param storage - storage implementation
 */
export function resolveUtmParams(
  query: UtmQuery,
  storage: UtmStorage | undefined = getBrowserStorage()
): UtmParams | undefined {
  const queryUtm = extractUtmParams(query);

  if (!queryUtm) {
    return readStoredUtmParams(storage);
  }

  try {
    storage?.setItem(UTM_STORAGE_KEY, JSON.stringify(queryUtm));
  } catch {
    /**
     * UTM propagation through the URL still works when storage is unavailable
     */
  }

  return queryUtm;
}

/**
 * Adds persisted UTM parameters to a route query without touching other params
 * @param query - target route query
 * @param storage - storage implementation
 */
export function preserveUtmQuery(
  query: UtmQuery,
  storage: UtmStorage | undefined = getBrowserStorage()
): UtmQuery {
  const utm = resolveUtmParams(query, storage);
  const result: UtmQuery = {};

  Object.entries(query).forEach(([key, value]) => {
    if (!VALID_UTM_KEYS.some(utmKey => key === `utm_${utmKey}`)) {
      result[key] = value;
    }
  });

  if (!utm) {
    return result;
  }

  Object.entries(utm).forEach(([key, value]) => {
    result[`utm_${key}`] = value;
  });

  return result;
}

/**
 * Captures UTM parameters from the browser URL before router redirects run
 */
export function captureUtmFromCurrentUrl(): UtmParams | undefined {
  if (!globalThis.location?.search) {
    return readStoredUtmParams();
  }

  const query = Object.fromEntries(new URLSearchParams(globalThis.location.search));

  return resolveUtmParams(query);
}
