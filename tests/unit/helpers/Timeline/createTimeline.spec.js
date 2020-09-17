import createTimeline from '@/helpers/Timeline/createTimeline';

const timeline = [
  { entry: 'Test1', date: 'SomeDate1' },
  { entry: 'Test2', date: 'SomeDate2' },
  { entry: 'Test3', date: 'SomeDate3' },
];

xdescribe('@/helpers/Timeline/createTimeline', () => {
  it('returns array', () => {
    expect(createTimeline(timeline)).toBeArray();
  });

  describe('when maxEntriesNum value is passed', () => {
    it('returns array with a length equals to maxEntriesNum', () => {
      expect(createTimeline(timeline, 2).length).toBe(2);
    });

    it('returns objects starting from the beginning of array', () => {
      const expectedArray = [
        { entry: 'Test1', date: 'SomeDate1' },
        { entry: 'Test2', date: 'SomeDate2' },
      ];
      expect(createTimeline(timeline, 2)).toEqual(expectedArray);
    });
  });
});
