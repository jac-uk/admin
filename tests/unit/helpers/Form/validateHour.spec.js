import validateHour from '@/helpers/Form/validateHour';

describe('helpers/validateHour', () => {
  it('returns null if value passed is null', () => {
    expect(validateHour(null)).toBe(null);
  });

  it('returns 0 if value passed is less than 0', () => {
    expect(validateHour(-1)).toBe(0);
  });

  it('returns 0 if value is not a number', () => {
    expect(validateHour('Five')).toBe(0);
  });

  it("returns 0 if value is '00'", () => {
    expect(validateHour('00')).toBe(0);
  });

  it('returns 23 if value is higher than 23 but not 24', () => {
    expect(validateHour(34)).toBe(23);
  });

  it('returns 0 if value is 24', () => {
    expect(validateHour(24)).toBe(0);
  });

  it('returns the value passed', () => {
    expect(validateHour(3)).toBe(3);
  });
});
