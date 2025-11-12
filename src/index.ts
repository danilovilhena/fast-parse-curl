import { Auth, extractAuth } from "./utils/extractAuth.js";
import { extractCookies } from "./utils/extractCookies.js";
import { extractData } from "./utils/extractData.js";
import { extractFormData } from "./utils/extractFormData.js";
import { extractHeaders } from "./utils/extractHeaders.js";
import { extractMethod } from "./utils/extractMethod.js";
import { CurlOptions, extractOptions } from "./utils/extractOptions.js";
import { extractUrl } from "./utils/extractUrl.js";
import { normalizeCommand } from "./utils/normalizeCommand.js";
import { parseJson } from "./utils/parseJson.js";
import { tokenizeCommand } from "./utils/tokenizeCommand.js";

export interface ParseCurlResult {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: object | string | null;
  form: Record<string, string>;
  auth: Auth;
  cookies: Record<string, string>;
  options: CurlOptions;
}

const DEFAULT_RESULT: ParseCurlResult = {
  method: "GET",
  url: "",
  headers: {},
  body: null,
  form: {},
  auth: {
    type: "basic",
    username: "",
    password: "",
    token: "",
  },
  cookies: {},
  options: {
    followRedirects: false,
    insecure: false,
    compressed: false,
    timeout: null,
    connectTimeout: null,
    verbose: false,
  },
};

const getDefaultResult = (): ParseCurlResult => {
  // Return a shallow copy to avoid mutation issues
  return {
    ...DEFAULT_RESULT,
    headers: {},
    form: {},
    cookies: {},
    auth: { ...DEFAULT_RESULT.auth },
    options: { ...DEFAULT_RESULT.options },
  };
};

/**
 * Parses a cURL command into a well-organized JSON object.
 * Handles any cURL format gracefully, returning partial results on errors.
 *
 * @param curlCommand - The cURL command to parse
 * @returns Parsed cURL object with method, url, headers, body, form, auth, cookies, options
 */
export const parseCurl = (curlCommand: string): ParseCurlResult => {
  if (typeof curlCommand !== "string") {
    return getDefaultResult();
  }

  const trimmed = curlCommand.trim();
  if (trimmed === "") {
    return getDefaultResult();
  }

  const normalized = normalizeCommand(trimmed);
  if (normalized === "") {
    return getDefaultResult();
  }

  // Tokenize once and reuse for all extractors (performance optimization)
  const tokens = tokenizeCommand(normalized);

  const method = extractMethod(normalized, tokens);
  const url = extractUrl(normalized, tokens);
  const headers = extractHeaders(normalized, tokens);
  const data = extractData(normalized, tokens);
  const form = extractFormData(normalized, tokens);
  const auth = extractAuth(normalized, tokens);
  const cookies = extractCookies(normalized, tokens);
  const options = extractOptions(normalized, tokens);

  let body: object | string | null = null;

  if (data !== null) {
    const parsed = parseJson(data);
    if (parsed !== undefined) {
      body = parsed as object;
    } else {
      body = data;
    }
  }

  return {
    method,
    url,
    headers,
    body,
    form,
    auth,
    cookies,
    options,
  };
};

// Export types for use in other modules
export type { Auth, CurlOptions };
