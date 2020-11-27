import { formatDate } from '@/filters';
import { firestore } from 'firebase';

const dateToday = new Date();
const dateArray = [1,1,2003];
const dateNum = 1600000000000;
const fireBaseTimestamp = new firestore.Timestamp.now(); 
const mockFireBaseTimestamp = {
  seconds: 1041379200,
  nanoseconds: 0,
};

const testCases = [
  dateToday,
  dateArray,
  dateNum,
];
const testCasesFirebases = [
  fireBaseTimestamp,
  mockFireBaseTimestamp,
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
  describe.each(testCasesFirebases)('valid test cases firebase', (testCaseFirebase) => {
    it.each`
    input               | type            | expected
    ${testCaseFirebase} |${''}            |${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB')}
    ${testCaseFirebase} |${null}          |${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB')}
    ${testCaseFirebase} |${'long'}        |${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
    ${testCaseFirebase} |${'month'}       |${`${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleString('en-GB', { month: 'long' })} ${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).getUTCFullYear()}`}
    ${testCaseFirebase} |${undefined}     |${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB')}
    ${testCaseFirebase} |${'datetime'}    |${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleString('en-GB')}
    ${testCaseFirebase} |${'longdatetime'}|${new Date(new Date(1e3 * testCaseFirebase.seconds + testCaseFirebase.nanoseconds / 1e6)).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
    `('when given $input with $type returns $expected', ({ input, type, expected }) => {
      expect(formatDate(input, type)).toBe(expected);
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
