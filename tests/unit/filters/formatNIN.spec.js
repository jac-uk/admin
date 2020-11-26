import { formatNIN } from '@/filters';

describe('Format NIN', () => {
  it('returns string capitalised', () => {
    expect(formatNIN('ni111111n')).toBe('NI111111N');
  });
});
