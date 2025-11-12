import { tokenizeCommand } from './tokenizeCommand.js';
import { extractHeaders } from './extractHeaders.js';

export interface Auth {
  type: 'basic' | 'digest' | 'bearer';
  username: string;
  password: string;
  token: string;
}

const HTTP_URL_REGEX = /^https?:\/\//;
const DEFAULT_AUTH: Auth = {
  type: 'basic',
  username: '',
  password: '',
  token: ''
};

/**
 * Extracts authentication information from cURL command.
 * Looks for -u/--user flags, or Bearer tokens in Authorization header.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns Auth object with type, username, password, and token
 */
export const extractAuth = (command: string, tokens?: string[]): Auth => {
  if (typeof command !== 'string') {
    return { ...DEFAULT_AUTH };
  }

  const commandTokens = tokens || tokenizeCommand(command);
  const auth: Auth = { ...DEFAULT_AUTH };

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '--basic') {
      auth.type = 'basic';
    }

    if (token === '--digest') {
      auth.type = 'digest';
    }

    if (token === '-u' || token === '--user') {
      if (i + 1 < commandTokens.length) {
        const credentials = commandTokens[i + 1];

        if (!HTTP_URL_REGEX.test(credentials)) {
          const colonIndex = credentials.indexOf(':');

          if (colonIndex !== -1) {
            auth.username = credentials.substring(0, colonIndex);
            auth.password = credentials.substring(colonIndex + 1);
          } else {
            auth.username = credentials;
          }

          if (auth.type === 'basic' || !auth.type) {
            auth.type = 'basic';
          }
        }
      }
      i++;
    }
  }

  const headers = extractHeaders(command, commandTokens);
  const authHeader = headers.Authorization || headers.authorization;

  if (authHeader) {
    if (authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer ')) {
      auth.type = 'bearer';
      auth.token = authHeader.substring(7).trim();
    }
  }

  return auth;
};

