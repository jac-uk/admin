import { formatCurrency } from '@/filters';

describe('Format Currency', () => {
  it('returns a string in GBP', () => {
    expect(formatCurrency('124000')).toBe('£124,000.00');
  });
  it('returns a number in GBP', () => {
    expect(formatCurrency(124000)).toBe('£124,000.00');
  });
  it('string without numbers returns 0 in GBP', () => {
    expect(formatCurrency('random text here')).toBe('£0.00');
  });
  it('string with numbers returns the number in GBP', () => {
    expect(formatCurrency('123000 random text here')).toBe('£123,000.00');
  });
  it('empty string returns 0 in GBP', () => {
    expect(formatCurrency('')).toBe('£0.00');
  });
  it('null string returns 0 in GBP', () => {
    expect(formatCurrency(null)).toBe('£0.00');
  });
});
