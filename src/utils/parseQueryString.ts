/**
 * Parses a URL query string into an object.
 * Handles edge cases gracefully.
 *
 * @param queryString - The query string (with or without leading ?)
 * @returns Object with key-value pairs
 */
export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  if (typeof queryString !== 'string') {
    return {};
  }

  const result: Record<string, string | string[]> = {};

  if (queryString === '') {
    return result;
  }

  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  if (cleanQuery === '') {
    return result;
  }

  const pairs = cleanQuery.split('&');

  for (const pair of pairs) {
    if (pair === '') {
      continue;
    }

    const equalIndex = pair.indexOf('=');

    if (equalIndex === -1) {
      result[decodeURIComponent(pair)] = '';
      continue;
    }

    const key = pair.substring(0, equalIndex);
    const value = pair.substring(equalIndex + 1);

    if (key === '') {
      continue;
    }

    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    if (result[decodedKey] === undefined) {
      result[decodedKey] = decodedValue;
    } else {
      if (Array.isArray(result[decodedKey])) {
        (result[decodedKey] as string[]).push(decodedValue);
      } else {
        result[decodedKey] = [result[decodedKey] as string, decodedValue];
      }
    }
  }

  return result;
};

