import { tokenizeCommand } from './tokenizeCommand.js';

const HTTP_URL_REGEX = /^https?:\/\//;

/**
 * Extracts headers from cURL command.
 * Handles -H and --header flags.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns Object with header names as keys and values as values
 */
export const extractHeaders = (command: string, tokens?: string[]): Record<string, string> => {
  if (typeof command !== 'string') {
    return {};
  }

  const headers: Record<string, string> = {};
  const commandTokens = tokens || tokenizeCommand(command);

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '-H' || token === '--header') {
      if (i + 1 < commandTokens.length) {
        const headerValue = commandTokens[i + 1];

        if (HTTP_URL_REGEX.test(headerValue)) {
          continue;
        }

        const colonIndex = headerValue.indexOf(':');

        if (colonIndex !== -1) {
          const name = headerValue.substring(0, colonIndex).trim();
          const value = headerValue.substring(colonIndex + 1).trim();

          if (name) {
            // Skip if the value part is a URL
            if (!HTTP_URL_REGEX.test(value)) {
              headers[name] = value;
            }
          }
        }
      }
      i++;
    }
  }

  return headers;
};

