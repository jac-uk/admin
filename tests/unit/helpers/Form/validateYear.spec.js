import validateYear from '@/helpers/Form/validateYear';

describe('helpers/Form/validateYear', () => {
  it('returns null if value is null', () => {
    expect(validateYear(null)).toBe(null);
  });

  it('returns null if value is not a number', () => {
    expect(validateYear('one thousand eighty four')).toBe(null);
  });

  it('returns null if length of the val is not equal to 4', () => {
    expect(validateYear(290)).toBe(null);
  });

  it('returns value', () => {
    expect(validateYear(1980)).toBe(1980);
  });
});
