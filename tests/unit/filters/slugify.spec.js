import { slugify } from '@/filters';

describe('slugify', () => {
  it('returns string', () => {
    expect(slugify('test')).toBe('test');
  });
});
