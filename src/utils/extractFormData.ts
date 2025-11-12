import { tokenizeCommand } from './tokenizeCommand.js';

const HTTP_URL_REGEX = /^https?:\/\//;

/**
 * Extracts form data from cURL command.
 * Handles --form and -F flags for multipart form data.
 *
 * @param command - The cURL command
 * @param tokens - Optional pre-tokenized command (for performance)
 * @returns Object with form field names as keys and values as values
 */
export const extractFormData = (command: string, tokens?: string[]): Record<string, string> => {
  if (typeof command !== 'string') {
    return {};
  }

  const form: Record<string, string> = {};
  const commandTokens = tokens || tokenizeCommand(command);

  for (let i = 0; i < commandTokens.length; i++) {
    const token = commandTokens[i];

    if (token === '-F' || token === '--form') {
      if (i + 1 < commandTokens.length) {
        const formValue = commandTokens[i + 1];

        if (!HTTP_URL_REGEX.test(formValue)) {
          const equalIndex = formValue.indexOf('=');

          if (equalIndex !== -1) {
            const key = formValue.substring(0, equalIndex);
            const value = formValue.substring(equalIndex + 1);

            if (key) {
              // Skip if the value part is a URL
              if (!HTTP_URL_REGEX.test(value)) {
                form[key] = value;
              }
            }
          } else if (formValue) {
            form[formValue] = '';
          }
        }
      }
      i++;
    }
  }

  return form;
};

