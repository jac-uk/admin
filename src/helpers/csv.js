/**
 * This function is used when converting arrays into CSV strings.
 * It does the following:
 * - Converts the value to a string using String(value).
 * - If the value starts with `=`, it prepends a single quote (`'`) to prevent formula interpretation in Excel.
 * - If the value contains any of the following special characters: comma (,), double quote ("), colon (:), semicolon (;), newline (\n), plus (+), minus (-), or at (@), it wraps the value in double quotes.
 * - If the value already contains double quotes, those quotes are escaped by replacing each " with "".
 *
 * @param {*} value - The value to be escaped.
 * @returns {string} - The escaped value suitable for CSV format.
 */
const escapeValue = (value) => {
  // Convert the value to a string
  let stringValue = String(value);

  // Prevent Excel from interpreting values starting with "=" as formulas
  if (stringValue.startsWith('=')) {
    stringValue = `'${stringValue}`;
  }

  // Check for special characters (comma, quote, colon, semicolon, newline, plus, minus, @)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes(':') ||
      stringValue.includes(';') || stringValue.includes('\n') || stringValue.includes('+') ||
      stringValue.includes('-') || stringValue.includes('@')) {

    // Escape internal double quotes and wrap the value in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  // Return the value as is if no special characters are found
  return stringValue;
};

export { escapeValue };
