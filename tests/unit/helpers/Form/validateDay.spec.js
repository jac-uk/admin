import validateDay from '@/helpers/Form/validateDay';

describe('helpers/Form/validateDay', () => {
  it('returns null if day is null', () => {
    expect(validateDay(null)).toBe(null);
  });

  it('returns null if day is not a number', () => {
    expect(validateDay('hello')).toBe(null);
  });

  it('returns 31 if value is bigger than 31', () => {
    expect(validateDay(50)).toBe(31);
  });

  it('returns 1 if value is smaller than 1', () => {
    expect(validateDay(-3)).toBe(1);
  });

  it('returns the value passed', () => {
    expect(validateDay(3)).toBe(3);
  });

  it.only('returns 1 if value is 0', () => {
    expect(validateDay(0)).toBe(1);
  });
});
