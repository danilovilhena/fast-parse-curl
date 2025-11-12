import { tokenizeCommand } from './tokenizeCommand.js';

const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'] as const;
const DATA_FLAG_REGEX = /-(?:d|data|data-raw|data-binary|data-urlencode|data-ascii)\b/;

/**
 * Extracts HTTP method from cURL command.
 * Looks for -X or --request flags, or infers from data flags.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns HTTP method (uppercase), defaults to 'GET'
 */
export const extractMethod = (command: string, tokens?: string[]): string => {
  if (typeof command !== 'string') {
    return 'GET';
  }

  const commandTokens = tokens || tokenizeCommand(command);
  let lastMethod: string | null = null;

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '-X' || token === '--request') {
      if (i + 1 < commandTokens.length) {
        const method = commandTokens[i + 1].toUpperCase();
        if (VALID_METHODS.includes(method as typeof VALID_METHODS[number])) {
          lastMethod = method;
        }
      }
    }
  }

  if (lastMethod) {
    return lastMethod;
  }

  if (DATA_FLAG_REGEX.test(command)) {
    return 'POST';
  }

  return 'GET';
};

