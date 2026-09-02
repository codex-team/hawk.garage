/**
 * Route query-like object (vue-router LocationQuery is compatible)
 */
type QueryLike = Record<string, unknown>;

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
 * Maximum allowed length for UTM parameter values
 */
const MAX_UTM_VALUE_LENGTH = 50;

/**
 * Session storage key for captured UTM params
 */
export const UTM_STORAGE_KEY = 'hawk_utm';

/**
 * Validates and filters UTM parameters
 * @param utm - UTM parameters to validate
 * @returns - filtered valid UTM parameters
 */
export function validateUtmParams(utm: any): Record<string, string> | undefined {
  if (!utm || typeof utm !== 'object' || Array.isArray(utm)) {
    return undefined;
  }

  const result: Record<string, string> = {};

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

  return result;
}

/**
 * First non-empty string from a query value (string or array)
 * @param value - query value
 */
function firstQueryString(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const found = value.find(item => typeof item === 'string' && item.length > 0);

    return typeof found === 'string' ? found : undefined;
  }

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return undefined;
}

/**
 * UTM object for API calls (`source`, `medium`, …) from a route query
 * @param query - route query
 */
export function getUtmFromQuery(query: QueryLike): Record<string, string> | undefined {
  const unprefixed: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (!key.startsWith('utm_')) {
      continue;
    }

    const raw = firstQueryString(value);

    if (raw === undefined) {
      continue;
    }

    unprefixed[key.slice('utm_'.length)] = raw;
  }

  const validated = validateUtmParams(unprefixed);

  if (!validated || Object.keys(validated).length === 0) {
    return undefined;
  }

  return validated;
}

/**
 * @param utm - validated UTM
 */
function writeUtm(utm: Record<string, string>): void {
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // sessionStorage may be unavailable
  }
}

/**
 * Stored UTM for signup
 */
export function getStoredUtm(): Record<string, string> | undefined {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as unknown;
    const validated = validateUtmParams(parsed);

    if (!validated || Object.keys(validated).length === 0) {
      return undefined;
    }

    return validated;
  } catch {
    return undefined;
  }
}

/**
 * Persist valid UTM from the current URL. Campaign fields are first-touch.
 * @param query - route query
 */
export function captureUtmFromQuery(query: QueryLike): void {
  const incoming = getUtmFromQuery(query);

  if (!incoming) {
    return;
  }

  const stored = getStoredUtm() ?? {};
  const next: Record<string, string> = { ...stored };

  for (const [key, value] of Object.entries(incoming)) {
    if (stored[key] === undefined) {
      next[key] = value;
    }
  }

  writeUtm(next);
}

/**
 * Registration from demo overwrites source
 */
export function saveDemoUtm(): void {
  writeUtm({
    ...getStoredUtm(),
    source: 'demo',
  });
}
