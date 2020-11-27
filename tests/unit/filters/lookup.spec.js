import { lookup } from '@/filters';

describe('lookup`', () => {
  describe('given `legal``', () => {
    it('returns string `Legal`', () => {
      expect(lookup('legal')).toBe('Legal');
    });
  });
});
