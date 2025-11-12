/**
 * Custom shell command tokenizer that handles quotes, escaping, and line continuations.
 * No external dependencies - pure JavaScript implementation.
 *
 * @param command - The shell command to tokenize
 * @returns Array of tokens
 */
export const tokenizeCommand = (command: string): string[] => {
  if (typeof command !== 'string') {
    return [];
  }

  if (command.trim() === '') {
    return [];
  }

  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;
  let i = 0;

  while (i < command.length) {
    const char = command[i];
    const nextChar = i < command.length - 1 ? command[i + 1] : '';

    if (escaped) {
      current += char;
      escaped = false;
      i++;
      continue;
    }

    if (char === '\\') {
      if (inSingleQuote) {
        current += char;
        i++;
        continue;
      } else if (inDoubleQuote) {
        if (nextChar === '"' || nextChar === '\\' || nextChar === '$' || nextChar === '`') {
          escaped = true;
          i++;
          continue;
        } else if (nextChar === '\n' || (nextChar === '\r' && command[i + 2] === '\n')) {
          current += '\\';
          current += '\\';
          current += 'n';
          i += nextChar === '\r' ? 3 : 2;
          continue;
        } else {
          current += char;
          i++;
          continue;
        }
      } else {
        if (nextChar === '\n' || (nextChar === '\r' && command[i + 2] === '\n')) {
          i += nextChar === '\r' ? 3 : 2;
          continue;
        } else {
          escaped = true;
          i++;
          continue;
        }
      }
    }

    if (char === "'" && !inDoubleQuote) {
      if (inSingleQuote && current === '') {
        tokens.push('');
      }
      inSingleQuote = !inSingleQuote;
      if (!inSingleQuote) {
        tokens.push(current);
        current = '';
      }
      i++;
      continue;
    }

    if (char === '"' && !inSingleQuote) {
      if (inDoubleQuote && current === '') {
        tokens.push('');
      }
      inDoubleQuote = !inDoubleQuote;
      if (!inDoubleQuote) {
        tokens.push(current);
        current = '';
      }
      i++;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (/\s/.test(char)) {
        if (current.trim() !== '') {
          tokens.push(current.trim());
          current = '';
        }
        i++;
        continue;
      }
    }

    current += char;
    i++;
  }

  if (!inSingleQuote && !inDoubleQuote) {
    if (current.trim() !== '') {
      tokens.push(current.trim());
    }
  } else {
    if (current.length > 0 || inSingleQuote || inDoubleQuote) {
      tokens.push(current);
    }
  }

  return tokens;
};

