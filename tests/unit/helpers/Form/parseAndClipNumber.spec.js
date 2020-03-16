import parseAndClipNumber from '@/helpers/Form/parseAndClipNumber';

xdescribe('helpers/Form/parseAndClipNumber', () => {
  it('returns null if the value is null', () => {
    expect(parseAndClipNumber(null, 1, 2)).toBe(null);
  });

  it('returns null if the value is not a number', () => {
    expect(parseAndClipNumber('hello', 1, 2)).toBe(null);
  });

  it('returns max value if the value is bigger than max', () => {
    expect(parseAndClipNumber(50, 1, 23)).toBe(23);
  });

  it('returns min value if the value is smaller than min', () => {
    expect(parseAndClipNumber(0, 1, 60)).toBe(1);
  });

  it('returns the value if it is within the range', () => {
    expect(parseAndClipNumber(1, 0, 60)).toBe(1);
  });
});
