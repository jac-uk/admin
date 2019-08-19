import zeroPad from '@/helpers/Form/zeroPad';

describe('helpers/zeroPad', () => {
  it('adds zero in the beginning is the lengths of the number is one', () => {
    expect(zeroPad(3)).toBe('03');
  });

  it('does not modify string with the length equal to two', () => {
    expect(zeroPad(33)).toBe('33');
  }); 

  it('returns null if value is undefined', () => {
    expect(zeroPad('')).toBe(null);
  }); 
});
