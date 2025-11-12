import { tokenizeCommand } from './tokenizeCommand.js';

const URL_FLAGS = ['--url'];
const SKIP_FLAGS = ['-X', '--request', '-H', '--header', '-d', '--data', '--data-raw', '--data-binary', '--data-urlencode', '--data-ascii', '-F', '--form', '-u', '--user', '-b', '--cookie', '-k', '--insecure', '-L', '--location', '--compressed', '--verbose', '-v', '--max-time', '--connect-timeout'];
const HTTP_URL_REGEX = /^https?:\/\//;

/**
 * Extracts URL from cURL command.
 * Looks for --url flag, or positional URL argument.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns The URL (full URL with query params if present)
 */
export const extractUrl = (command: string, tokens?: string[]): string => {
  if (typeof command !== 'string') {
    return '';
  }

  const commandTokens = tokens || tokenizeCommand(command);

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];
    if (URL_FLAGS.includes(token)) {
      if (i + 1 < commandTokens.length) {
        return commandTokens[i + 1];
      }
    }
  }

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === 'curl' || token === 'curl.exe') {
      continue;
    }

    if (token.startsWith('-')) {
      const flagName = token.split('=')[0];
      if (SKIP_FLAGS.includes(flagName)) {
        i++;
        continue;
      }
      if (flagName.startsWith('--max-time') || flagName.startsWith('--connect-timeout')) {
        i++;
        continue;
      }
      continue;
    }

    if (HTTP_URL_REGEX.test(token)) {
      return token;
    }
  }

  return '';
};

