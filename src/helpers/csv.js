/**
 * This function is used when converting arrays into CSV strings.
 * It ensures safe handling of special characters to prevent CSV injection.
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

  // Check for special characters that need to be escaped
  const specialCharsPattern = /[,;"\n:@+\-]/;
  if (specialCharsPattern.test(stringValue)) {
    // Escape internal double quotes and wrap the value in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  // Return the value as is if no special characters are found
  return stringValue;
};

export { escapeValue };
