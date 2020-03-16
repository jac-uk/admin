import zeroPad from '@/helpers/Form/zeroPad';

xdescribe('helpers/zeroPad', () => {
  it('adds zero in the beginning is the lengths of the number is one', () => {
    expect(zeroPad(3)).toBe('03');
  });

  it('does not modify string with the length equal to two', () => {
    expect(zeroPad(33)).toBe('33');
  }); 

  it('returns null if the value passed is not a number', () => {
    expect(zeroPad('string')).toBe(null);
    expect(zeroPad(undefined)).toBe(null);
    expect(zeroPad(true)).toBe(null);
    expect(zeroPad(null)).toBe(null);
  });

  it('returns "00" if 0 is passed', () => {
    expect(zeroPad(0)).toBe('00');
  }); 
});
