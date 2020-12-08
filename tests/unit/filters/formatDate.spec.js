import { formatDate } from '@/filters';
import { firestore } from 'firebase';

const dateToday = new Date();
const dateArray = [1,1,2003];
const dateNum = 1600000000000;
const testCaseFirebase = new firestore.Timestamp.now(); 
const mockTestCaseFirebase = {
  _seconds: 1041379200,
  _nanoseconds: 0,
};

const testCases = [
  dateToday,
  dateArray,
  dateNum,
];

describe('Format Date', () => {

  describe.each(testCases)('validtestCases', (testCase) => {
    it.each`
    input       | type            | expected
    ${testCase} |${''}            |${new Date(testCase).toLocaleDateString('en-GB')}
    ${testCase} |${null}          |${new Date(testCase).toLocaleDateString('en-GB')}
    ${testCase} |${'long'}        |${new Date(testCase).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
    ${testCase} |${'month'}       |${`${new Date(testCase).toLocaleString('en-GB', { month: 'long' })} ${new Date(testCase).getUTCFullYear()}`}
    ${testCase} |${undefined}     |${new Date(testCase).toLocaleDateString('en-GB')}
    ${testCase} |${'datetime'}    |${new Date(testCase).toLocaleString('en-GB')}
    ${testCase} |${'longdatetime'}|${new Date(testCase).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
    `('when given $input with $type returns $expected', ({ input, type, expected }) => {
      expect(formatDate(input, type)).toBe(expected);
    });
  });
  describe('valid test cases mocked firebase', () => {
    it('when given firebase timestamp with \'\' returns today', () => {
      expect(formatDate(mockTestCaseFirebase, '')).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with null returns today', () => {
      expect(formatDate(mockTestCaseFirebase, null)).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with undefined returns today', () => {
      expect(formatDate(mockTestCaseFirebase, undefined)).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with \'long\' returns today', () => {
      expect(formatDate(mockTestCaseFirebase, 'long')).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }));
    });
    it('when given firebase timestamp with \'month\' returns today', () => {
      expect(formatDate(mockTestCaseFirebase, 'month')).toBe(`${new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleString('en-GB', { month: 'long' })} ${new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).getUTCFullYear()}`);
    });
    it('when given firebase timestamp with \'datetime\' returns today', () => {
      expect(formatDate(mockTestCaseFirebase, 'datetime')).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleString('en-GB'));
    });
    it('when given firebase timestamp with \'longdatetime\' returns today', () => {
      expect(formatDate(mockTestCaseFirebase, 'longdatetime')).toBe(new Date(new Date(1e3 * mockTestCaseFirebase._seconds + mockTestCaseFirebase._nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }));
    });
  });
  describe('valid test cases firebase', () => {
    it('when given firebase timestamp with \'\' returns today', () => {
      expect(formatDate(testCaseFirebase, '')).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with null returns today', () => {
      expect(formatDate(testCaseFirebase, null)).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with undefined returns today', () => {
      expect(formatDate(testCaseFirebase, undefined)).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB'));
    });
    it('when given firebase timestamp with \'long\' returns today', () => {
      expect(formatDate(testCaseFirebase, 'long')).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }));
    });
    it('when given firebase timestamp with \'month\' returns today', () => {
      expect(formatDate(testCaseFirebase, 'month')).toBe(`${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleString('en-GB', { month: 'long' })} ${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).getUTCFullYear()}`);
    });
    it('when given firebase timestamp with \'datetime\' returns today', () => {
      expect(formatDate(testCaseFirebase, 'datetime')).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleString('en-GB'));
    });
    it('when given firebase timestamp with \'longdatetime\' returns today', () => {
      expect(formatDate(testCaseFirebase, 'longdatetime')).toBe(new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }));
    });
  });

  describe('invalid date', () => {
    
    const invalidTypes = [
      ['string', 'string'],
      [null, null],
      [undefined, undefined],
      [[], []],
    ];
    
    it.each(invalidTypes)('when given %o', (value, result) => {
      expect(formatDate(value)).toEqual(result);
    });
  });

});
