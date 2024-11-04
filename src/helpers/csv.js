/**
 * This function is used when converting arrays into csv strings
 * It does the following:
 * - Converts the value to a string using String(value)
 * - If the value contains a comma (,), double quotes ("), or other special characters, it wraps the value in double quotes
 * - If the value already contains double quotes, those quotes are escaped by replacing each " with ""
 * @param {*} value
 * @returns
 */
const escapeValue = (value) => {

  // Convert the value to a string and wrap in quotes if it contains commas or quotes
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes(':') || stringValue.includes(';') || stringValue.includes('\n')) {
    console.log(value);
    // Escape internal double quotes and wrap the value in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export {
  escapeValue
};
