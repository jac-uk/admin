import clipNumber from '@/helpers/Form/clipNumber';

describe('helpers/Form/clipNumber', () => {
  describe('when value is not a number', () => {
    it('returns null if value is a string', () => {
      expect(clipNumber('hello', 12, 13)).toBe(null);
    });
    it('returns null if value is null', () => {
      expect(clipNumber(null, 12, 13)).toBe(null);
    });
    it('returns null if value is undefined', () => {
      expect(clipNumber(undefined, 12, 13)).toBe(null);
    });
  });

  describe('invalid arguments', () => {
    it('returns null if max or min are not passed', () => {
      expect(clipNumber(15, 17)).toBe(null);
    });
  });

  describe('when value is smaller than min', () => {
    it('returns min', () => {
      expect(clipNumber(0, 1, 59)).toBe(1);
    });
  });

  describe('when value is larger than max', () => {
    it('returns min', () => {
      expect(clipNumber(56, 1, 23)).toBe(23);
    });
  });

  describe('when value is in a range', () => {
    it('returns value', () => {
      expect(clipNumber(15, 1, 23)).toBe(15);
    });
  });
});

