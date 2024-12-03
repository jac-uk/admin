import { escapeValue } from '@/helpers/csv.js';

describe('escapeValue', () => {
  it('should return the string representation of a value', () => {
    expect(escapeValue(123)).toBe('123');
    expect(escapeValue(true)).toBe('true');
    expect(escapeValue(null)).toBe('null');
    expect(escapeValue(undefined)).toBe('undefined');
  });

  it('should prevent Excel from interpreting values starting with "="', () => {
    expect(escapeValue('=SUM')).toBe("'=SUM");  // Prepends with single quote
  });

  it('should escape special characters by wrapping the value in double quotes', () => {
    expect(escapeValue('Hello, World')).toBe('"Hello, World"'); // Comma
    expect(escapeValue('Hello"World')).toBe('"Hello""World"'); // Double quotes
    expect(escapeValue('Hello:World')).toBe('"Hello:World"'); // Colon
    expect(escapeValue('Hello;World')).toBe('"Hello;World"'); // Semicolon
    expect(escapeValue('Hello\nWorld')).toBe('"Hello\nWorld"'); // Newline
    expect(escapeValue('Hello+World')).toBe('"Hello+World"'); // Plus sign
    expect(escapeValue('Hello-World')).toBe('"Hello-World"'); // Minus sign
    expect(escapeValue('Hello@World')).toBe('"Hello@World"'); // At symbol
  });

  it('should escape double quotes within the string by doubling them', () => {
    // Test for simple cases of a single double quote
    expect(escapeValue('Hello "World"')).toBe('"Hello ""World"""');

    // Test with multiple occurrences of double quotes in a string
    expect(escapeValue('Hello "World" and "Universe"')).toBe('"Hello ""World"" and ""Universe"""');

    // Edge case: no quotes, should return unchanged
    expect(escapeValue('Hello World')).toBe('Hello World');

    // Edge case: empty string, should return empty
    expect(escapeValue('')).toBe('');

    // Edge case: leading equal sign, should prevent formula interpretation
    expect(escapeValue('=SUM(A1:A10)')).toBe('"\'=SUM(A1:A10)"');
  });

  it('should return the value as is if no special characters are found', () => {
    expect(escapeValue('HelloWorld')).toBe('HelloWorld'); // No special characters
  });
});
