import { tokenizeCommand } from './tokenizeCommand.js';

const DATA_FLAGS = ['-d', '--data', '--data-raw', '--data-binary', '--data-urlencode', '--data-ascii'];
const HTTP_URL_REGEX = /^https?:\/\//;

/**
 * Extracts request body data from cURL command.
 * Handles -d, --data, --data-raw, --data-binary, --data-urlencode, --data-ascii.
 * Combines multiple data flags with &.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns The request body data, or null if not found
 */
export const extractData = (command: string, tokens?: string[]): string | null => {
  if (typeof command !== 'string') {
    return null;
  }

  const commandTokens = tokens || tokenizeCommand(command);
  const dataParts: string[] = [];

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (DATA_FLAGS.includes(token)) {
      if (i + 1 < commandTokens.length) {
        const nextToken = commandTokens[i + 1];
        if (!HTTP_URL_REGEX.test(nextToken)) {
          dataParts.push(nextToken);
        }
      } else {
        dataParts.push('');
      }
      i++;
    }
  }

  if (dataParts.length === 0) {
    return null;
  }

  return dataParts.join('&');
};

