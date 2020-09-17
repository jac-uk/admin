import booleanOrNull from '@/helpers/booleanOrNull';

xdescribe('@/helpers/booleanOrNull', () => {
  it('is a function', () => {
    expect(booleanOrNull).toBeInstanceOf(Function);
  });

  describe('when input value is boolean `true`', () => {
    it('returns boolean `true`', () => {
      expect(booleanOrNull(true)).toBe(true);
    });
  });

  describe('when input value is boolean `false`', () => {
    it('returns boolean `false`', () => {
      expect(booleanOrNull(false)).toBe(false);
    });
  });

  describe('when input value is not a boolean', () => {
    it('returns `null`', () => {
      expect(booleanOrNull('a string value')).toBeNull();
      expect(booleanOrNull('true')).toBeNull();
      expect(booleanOrNull('false')).toBeNull();
      expect(booleanOrNull(1)).toBeNull();
      expect(booleanOrNull(0)).toBeNull();
      expect(booleanOrNull(-1)).toBeNull();
      expect(booleanOrNull({})).toBeNull();
      expect(booleanOrNull(new Date())).toBeNull();
    });
  });
});
