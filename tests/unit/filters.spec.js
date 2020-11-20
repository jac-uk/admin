import { heldFeePaidJudicialRole, formatCurrency } from '@/filters';

  describe('when input value is string `fee-paid-court-post`', () => {
    it('returns string `Yes`', () => {
      expect(heldFeePaidJudicialRole('fee-paid-court-post')).toBe('Yes');
    });
  });

describe('when input value is string `fee-paid-tribunal-post`', () => {
  it('returns string `Yes`', () => {
    expect(heldFeePaidJudicialRole('fee-paid-tribunal-post')).toBe('Yes');
  });
});

describe('when input value is string `other-fee-paid-judicial-office`', () => {
  it('returns string `Yes`', () => {
    expect(heldFeePaidJudicialRole('other-fee-paid-judicial-office')).toBe('Yes');
  });
});

describe('when input value is string `prefer-not-to-say`', () => {
  it('returns string `Prefer not to say`', () => {
    expect(heldFeePaidJudicialRole('prefer-not-to-say')).toBe('Prefer not to say');
  });
});

describe('when input value is boolean `false`', () => {
  it('returns string `No`', () => {
    expect(heldFeePaidJudicialRole(false)).toBe('No');
  });
});

describe('when input value is an empty string', () => {
  it('returns string `Unknown`', () => {
    expect(heldFeePaidJudicialRole('')).toBe('Unknown');
  });
});

describe('when input value is null', () => {
  it('returns string `Unknown`', () => {
    expect(heldFeePaidJudicialRole(null)).toBe('Unknown');
  });
});

describe('when input value is undefined', () => {
  it('returns string `Unknown`', () => {
    expect(heldFeePaidJudicialRole(undefined)).toBe('Unknown');
  });
});

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
