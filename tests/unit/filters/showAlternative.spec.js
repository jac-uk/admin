import { showAlternative } from '@/filters';

describe('showAlternative', () => {
  it('show true value', () => {
    expect(showAlternative('test', false)).toBe('test');
  });
  it('show true value', () => {
    expect(showAlternative(false, 'test')).toBe('test');
  });
  it('shows first true value', () => {
    expect(showAlternative('test', true)).toBe('test');
  });
});
