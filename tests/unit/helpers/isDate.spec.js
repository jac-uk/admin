import isDate from '@/helpers/isDate';

describe('@/helpers/isDate', () => {
  it('returns true if the value passed is an instance of a date', () => {
    expect(isDate(new Date('Sun Nov 11 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBe(true);
  });

  it('returns false if the value passed is not an instance of a date', () => {
    expect(isDate('')).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate(235)).toBe(false);
    expect(isDate([{}, {}])).toBe(false);
  });
});
