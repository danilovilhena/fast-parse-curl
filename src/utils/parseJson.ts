/**
 * Parses a JSON string or returns the input directly if it is already an object.
 * Provides fallback behavior in case of parsing errors.
 *
 * @param str - The JSON string to parse or an object to return as-is.
 * @param options - Options for parsing.
 * @param options.fallback - If `true`, returns the original input string
 *   if parsing fails, instead of returning `undefined`.
 *
 * @returns The parsed object if successful, the original string if fallback is
 *   enabled and parsing fails, or `undefined` if parsing fails without fallback.
 *
 * @example
 * // Parsing a valid JSON string
 * const jsonString = '{"name":"Alice","age":30}';
 * const result = parseJson(jsonString);
 * console.log(result); // Output: { name: 'Alice', age: 30 }
 *
 * @example
 * // Returning an object directly
 * const obj = { name: 'Bob', age: 25 };
 * const result = parseJson(obj);
 * console.log(result); // Output: { name: 'Bob', age: 25 }
 *
 * @example
 * // Handling parsing error with fallback
 * const invalidJson = '{"name":"Alice",age:30}'; // Invalid JSON (missing quotes around "age")
 * const result = parseJson(invalidJson, { fallback: true });
 * console.log(result); // Output: '{"name":"Alice",age:30}'
 */
export const parseJson = (
  str: string | object,
  options?: {
    fallback?: boolean;
  }
): object | string | undefined => {
  if (typeof str === "object") {
    return str;
  }

  try {
    return JSON.parse(str);
  } catch (error) {
    if (options?.fallback === true) {
      return str;
    }
    return undefined;
  }
};
