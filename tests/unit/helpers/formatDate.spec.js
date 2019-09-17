import formatDate from '@/helpers/formatDate';

describe('@/helpers/formatDate', () => {
  it('returns undefined if the value passed is not an instance of date', () => {
    expect(formatDate('string')).toBe(undefined);
  });

  it('returns date in format dd month year if type is not passed', () => {
    expect(formatDate(new Date('Fri Mar 01 2013 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBe('1 March 2013');
  });

  it('returns date in format dd month year hour:min if type is equal to time', () => {
    expect(formatDate(new Date('Fri Mar 01 2013 15:06:00 GMT+0000 (Greenwich Mean Time)'), 'time')).toBe('1 March 2013 3:06 PM');
  });
});
