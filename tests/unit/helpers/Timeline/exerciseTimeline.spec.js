import exerciseTimeline from '@/helpers/Timeline/exerciseTimeline';

xdescribe('@/helpers/Timeline/exerciseTimeline', () => {
  xdescribe('QT entry', () => {
    xdescribe('when all three dates are available', () => {
      it('contains all dates', () => {
        const data = {
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

    xdescribe('when one of the dates is missing', () => {
      it('contains available dates and null where data is missing', () => {
        const data = {
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

    xdescribe('when all dates are missing', () => {
      it('is equal to null', () => {
        const data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'QT',
        });
      });
    });
  });

  xdescribe('Scenario test entry', () => {
    xdescribe('when all three dates are available', () => {
      it('contains all dates', () => {
        const data = {
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

    xdescribe('when one of the dates is missing', () => {
      it('contains available dates and null where data is missing', () => {
        const data = {
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

    xdescribe('when all dates are missing', () => {
      it('is equal to null', () => {
        const data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'Scenario test',
        });
      });
    });
  });

  xdescribe('Selection day entry', () => {
    xdescribe('when all dates are available', () => {
      it('contains all dates', () => {
        const data = {
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

    xdescribe('when one of the dates is not available', () => {
      it('contains null where date is missing', () => {
        const data = {
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

    xdescribe('when all dates are not available', () => {
      it('is equal to null', () => {
        const data = {};
        expect(exerciseTimeline(data)).toContainEqual({
          date: null,
          entry: 'Selection day',
        });
      });
    });
  });
});
