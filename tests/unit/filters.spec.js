import { heldFeePaidJudicialRole } from '@/filters';

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
  it('returns string `Prefer not to say`', () => {
    expect(heldFeePaidJudicialRole('')).toBe('Prefer not to say');
  });
});

describe('when input value is null', () => {
  it('returns string `Prefer not to say`', () => {
    expect(heldFeePaidJudicialRole(null)).toBe('Prefer not to say');
  });
});
