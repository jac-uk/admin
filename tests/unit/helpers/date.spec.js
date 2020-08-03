import * as helpers from '@/helpers/date';

describe('@/helpers/date/formatDate', () => {
  it('throws an error if the value passed is not an instance of Date', () => {
    expect(() => helpers.formatDate('string')).toThrow();
  });

  it('returns date in format "dd month year" if `type` is not passed', () => {
    expect(helpers.formatDate(new Date('Fri Mar 01 2013 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBe('1 March 2013');
  });

  it('returns date in 12-hour time format "hh:mm am/pm" if `type` is equal to "time"', () => {
    expect(helpers.formatDate(new Date('Fri Mar 01 2013 15:06:00 GMT+0000 (Greenwich Mean Time)'), 'time')).toBe('3:06 pm');
  });

  it('returns date in format "month year" if `type` is equal to "month"', () => {
    expect(helpers.formatDate(new Date('Fri Mar 01 2013 15:06:00 GMT+0000 (Greenwich Mean Time)'), 'month')).toBe('March 2013');
  });
});

describe('@/helpers/date/isDateGreaterThan', () => {
  it('returns true if dateOne is greater than dateTwo', () => {
    expect(helpers.isDateGreaterThan(Date.now(), new Date('Sun Nov 11 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBeTruthy();
  });

  it('returns false if dateTwo is greater than dateOne', () => {
    expect(helpers.isDateGreaterThan(new Date('Sun Nov 11 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'), Date.now())).toBeFalsy();
  });

  it('returns false if one is not a date', () => {
    expect(helpers.isDateGreaterThan("random", Date.now())).toBeFalsy();
    expect(helpers.isDateGreaterThan(Date.now(), "random")).toBeFalsy();
  });

  it('returns false if neither is a date', () => {
    expect(helpers.isDateGreaterThan("random", "random")).toBeFalsy();
  });
});

describe('@/helpers/date/isDate', () => {
  it('returns true if the value passed is an instance of a date', () => {
    expect(helpers.isDate(new Date('Sun Nov 11 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'))).toBe(true);
  });

  it('returns false if the value passed is not an instance of a date', () => {
    expect(helpers.isDate('')).toBe(false);
    expect(helpers.isDate(null)).toBe(false);
    expect(helpers.isDate(undefined)).toBe(false);
    expect(helpers.isDate(235)).toBe(false);
    expect(helpers.isDate([{}, {}])).toBe(false);
  });
});
