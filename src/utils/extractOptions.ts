import { tokenizeCommand } from './tokenizeCommand.js';

export interface CurlOptions {
  followRedirects: boolean;
  insecure: boolean;
  compressed: boolean;
  timeout: number | null;
  connectTimeout: number | null;
  verbose: boolean;
}

const DEFAULT_OPTIONS: CurlOptions = {
  followRedirects: false,
  insecure: false,
  compressed: false,
  timeout: null,
  connectTimeout: null,
  verbose: false
};

/**
 * Extracts curl options from command.
 * Handles --compressed, --insecure/-k, --location/-L, --max-time, --connect-timeout, --verbose/-v.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns Options object
 */
export const extractOptions = (command: string, tokens?: string[]): CurlOptions => {
  if (typeof command !== 'string') {
    return { ...DEFAULT_OPTIONS };
  }

  const commandTokens = tokens || tokenizeCommand(command);
  const options: CurlOptions = { ...DEFAULT_OPTIONS };

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '--compressed') {
      options.compressed = true;
    } else if (token === '--insecure' || token === '-k') {
      options.insecure = true;
    } else if (token === '--location' || token === '-L') {
      options.followRedirects = true;
    } else if (token === '--verbose' || token === '-v') {
      options.verbose = true;
    } else if (token === '--max-time') {
      if (i + 1 < commandTokens.length) {
        const timeout = parseInt(commandTokens[i + 1], 10);
        if (!isNaN(timeout)) {
          options.timeout = timeout;
        }
      }
      i++;
    } else if (token === '--connect-timeout') {
      if (i + 1 < commandTokens.length) {
        const timeout = parseInt(commandTokens[i + 1], 10);
        if (!isNaN(timeout)) {
          options.connectTimeout = timeout;
        }
      }
      i++;
    }
  }

  return options;
};

