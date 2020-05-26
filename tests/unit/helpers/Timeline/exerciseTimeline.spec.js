import exerciseTimeline from '@/helpers/Timeline/exerciseTimeline';

xdescribe('@/helpers/Timeline/exerciseTimeline', () => {
  describe('QT entry', () => {
    describe('when all three dates are available', () => {
      it('contains all dates', () => {
        let data = {
          sjcaTestDate: new Date('Sun Nov 11 2012 08:00:00 GMT+0000 (Greenwich Mean Time)'),
          sjcaTestStartTime: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          sjcaTestEndTime: new Date('Sun Nov 11 2012 21:00:00 GMT+0000 (Greenwich Mean Time)'),
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 - 9:05 am to 9:00 pm',
          entry: 'QT',
        });
      });
    });

    describe('when one of the dates is missing', () => {
      it('contains available dates and null where data is missing', () => {
        let data = {
          sjcaTestDate: new Date('Sun Nov 11 2012 08:00:00 GMT+0000 (Greenwich Mean Time)'),
          sjcaTestStartTime: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          sjcaTestEndTime: null,
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 - 9:05 am to null',
          entry: 'QT',
        });
      });
    });

    describe('when all dates are missing', () => {
      it('is equal to null', () => {
        let data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'QT',
        });
      });
    });
  });

  describe('Scenario test entry', () => {
    describe('when all three dates are available', () => {
      it('contains all dates', () => {
        let data = {
          scenarioTestDate: new Date('Sun Nov 11 2012 08:00:00 GMT+0000 (Greenwich Mean Time)'),
          scenarioTestStartTime: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          scenarioTestEndTime: new Date('Sun Nov 11 2012 21:00:00 GMT+0000 (Greenwich Mean Time)'),
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 - 9:05 am to 9:00 pm',
          entry: 'Scenario test',
        });
      });
    });

    describe('when one of the dates is missing', () => {
      it('contains available dates and null where data is missing', () => {
        let data = {
          scenarioTestDate: new Date('Sun Nov 11 2012 08:00:00 GMT+0000 (Greenwich Mean Time)'),
          scenarioTestStartTime: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          scenarioTestEndTime: null,
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 - 9:05 am to null',
          entry: 'Scenario test',
        });
      });
    });

    describe('when all dates are missing', () => {
      it('is equal to null', () => {
        let data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'Scenario test',
        });
      });
    });
  });

  describe('Selection day entry', () => {
    describe('when all dates are available', () => {
      it('contains all dates', () => {
        let data = {
          selectionDays: [{
            selectionDayStart: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
            selectionDayEnd: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          }],
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 to 11 November 2012',
          entry: 'Selection day',
        });
      });
    });

    describe('when one of the dates is not available', () => {
      it('contains null where date is missing', () => {
        let data = {
          selectionDays: [{
            selectionDayStart: new Date('Sun Nov 11 2012 09:05:00 GMT+0000 (Greenwich Mean Time)'),
          }],
        };
        expect(exerciseTimeline(data)).toContainEqual({
          date: '11 November 2012 to null',
          entry: 'Selection day',
        });
      });
    });

    describe('when all dates are not available', () => {
      it('is equal to null', () => {
        let data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'Selection day',
        });
      });
    });
  });
});
