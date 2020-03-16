import formatDate from '@/helpers/formatDate';

xdescribe('@/helpers/formatDate', () => {
  it('throws an error if the value passed is not an instance of Date', () => {
    expect(() => formatDate('string')).toThrow();
  });

  it('returns date in format "dd month year" if `type` is not passed', () => {
    expect(formatDate(new Date('Fri Mar 01 2013 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBe('1 March 2013');
  });

  it('returns date in 12-hour time format "hh:mm am/pm" if `type` is equal to "time"', () => {
    expect(formatDate(new Date('Fri Mar 01 2013 15:06:00 GMT+0000 (Greenwich Mean Time)'), 'time')).toBe('3:06 pm');
  });

  it('returns date in format "month year" if `type` is equal to "month"', () => {
    expect(formatDate(new Date('Fri Mar 01 2013 15:06:00 GMT+0000 (Greenwich Mean Time)'), 'month')).toBe('March 2013');
  });
});
