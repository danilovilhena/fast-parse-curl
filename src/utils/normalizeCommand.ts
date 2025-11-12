/**
 * Normalizes a cURL command by handling line continuations and trimming whitespace.
 *
 * @param command - The cURL command to normalize
 * @returns Normalized command string
 */
export const normalizeCommand = (command: string): string => {
  if (typeof command !== 'string') {
    return '';
  }

  let normalized = command;
  normalized = normalized.replace(/\\\r?\n/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ');
  normalized = normalized.trim();

  return normalized;
};

