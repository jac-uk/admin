import validateMinute from '@/helpers/Form/validateMinute';

describe('helpers/validateMinute', () => {
  it('returns null if value passed is null', () => {
    expect(validateMinute(null)).toBe(null);
  });

  it('returns 0 if value passed is less than 0', () => {
    expect(validateMinute(-1)).toBe(0);
  });

  it('returns 0 if value is not a number', () => {
    expect(validateMinute('Five')).toBe(0);
  });

  it('returns 59 if value is higher than 59', () => {
    expect(validateMinute(60)).toBe(59);
  });

  it('returns the value passed', () => {
    expect(validateMinute(3)).toBe(3);
  });
});
