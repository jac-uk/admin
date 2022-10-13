import { formatNumber } from '@/filters';

describe('filters', () => {
  it('formatNumber', () => {
    expect(formatNumber(100)).toEqual('100');
    expect(formatNumber(1000)).toEqual('1,000');
    expect(formatNumber(100000)).toEqual('100,000');
    expect(formatNumber(1000000)).toEqual('1,000,000');
    expect(formatNumber('1000')).toEqual('1000');
    expect(formatNumber(null)).toEqual(null);
    expect(formatNumber(undefined)).toEqual(undefined);
  });
});
