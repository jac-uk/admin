import validateMonth from '@/helpers/Form/validateMonth';

describe('helpers/Form/validateMonth', () => {
  it('returns null if value is null', () => {
    expect(validateMonth(null)).toBe(null);
  });

  it('returns null if value is not a number', () => {
    expect(validateMonth('September')).toBe(null);
  });

  it('returns 12 if value is bigger than 12', () => {
    expect(validateMonth(67)).toBe(12);
  });

  it('returns 1 if value is smaller than 1', () => {
    expect(validateMonth(-4)).toBe(1);
  });

  it('returns value', () => {
    expect(validateMonth(10)).toBe(10);
  });
});
