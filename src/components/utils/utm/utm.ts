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
    const found = value.find((item) => typeof item === 'string' && item.length > 0);

    return typeof found === 'string' ? found : undefined;
  }

  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  return undefined;
}

/**
 * Valid `utm_*` params from a route query, still prefixed
 * @param query - current or previous route query
 */
export function extractUtmQuery(query: QueryLike): Record<string, string> {
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

  if (!validated) {
    return {};
  }

  const prefixed: Record<string, string> = {};

  for (const [key, value] of Object.entries(validated)) {
    prefixed[`utm_${key}`] = value;
  }

  return prefixed;
}

/**
 * Copy UTM from the previous route when the next one has none.
 * Returns null when the query should stay as-is.
 * @param toQuery - destination route query
 * @param fromQuery - source route query
 */
export function mergeUtmIntoQuery<T extends QueryLike>(toQuery: T, fromQuery: QueryLike): T | null {
  if (Object.keys(extractUtmQuery(toQuery)).length > 0) {
    return null;
  }

  const fromUtm = extractUtmQuery(fromQuery);

  if (Object.keys(fromUtm).length === 0) {
    return null;
  }

  return {
    ...toQuery,
    ...fromUtm,
  };
}

/**
 * UTM object for API calls (`source`, `medium`, …) from a route query
 * @param query - route query
 */
export function getUtmFromQuery(query: QueryLike): Record<string, string> | undefined {
  const prefixed = extractUtmQuery(query);

  if (Object.keys(prefixed).length === 0) {
    return undefined;
  }

  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(prefixed)) {
    result[key.slice('utm_'.length)] = value;
  }

  return result;
}
