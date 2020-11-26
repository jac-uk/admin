import { toYesNo } from '@/filters';

describe('returns `No`', () => {
  it(' when given false Boolean', () => {
    expect(toYesNo(false)).toBe('No');
  });
});
describe('returns `Yes`', () => {
  it(' when given true Boolean', () => {
    expect(toYesNo(true)).toBe('Yes');
  });
});
