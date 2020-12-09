import { toHumanCase } from '@/filters';

describe('toHumanCase', () => {
  it('returns ??', () => {
    expect(toHumanCase('124000')).toBe(' 1 2 4 0 0 0');
  });
});
