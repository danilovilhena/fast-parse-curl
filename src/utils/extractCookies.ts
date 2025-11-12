import { tokenizeCommand } from './tokenizeCommand.js';

const HTTP_URL_REGEX = /^https?:\/\//;

const parseCookieString = (cookieString: string): Record<string, string> => {
  if (!cookieString || typeof cookieString !== 'string') {
    return {};
  }

  const cookies: Record<string, string> = {};
  const pairs = cookieString.split(';');

  for (const pair of pairs) {
    const trimmed = pair.trim();

    if (!trimmed) {
      continue;
    }

    const equalIndex = trimmed.indexOf('=');

    if (equalIndex === -1) {
      cookies[trimmed] = '';
    } else {
      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      if (key) {
        cookies[key] = value;
      }
    }
  }

  return cookies;
};

/**
 * Extracts cookies from cURL command.
 * Handles -b and --cookie flags.
 * Parses cookie string into object format.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns Object with cookie names as keys and values as values
 */
export const extractCookies = (command: string, tokens?: string[]): Record<string, string> => {
  if (typeof command !== 'string') {
    return {};
  }

  const commandTokens = tokens || tokenizeCommand(command);
  const cookies: Record<string, string> = {};

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '-b' || token === '--cookie') {
      if (i + 1 < commandTokens.length) {
        const cookieString = commandTokens[i + 1];

        if (!HTTP_URL_REGEX.test(cookieString)) {
          const parsed = parseCookieString(cookieString);
          Object.assign(cookies, parsed);
        }
      }
      i++;
    }
  }

  return cookies;
};

