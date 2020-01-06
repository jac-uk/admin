import formatDate from '@/helpers/formatDate';
import isDate from '@/helpers/isDate';

const createQT = (data) => {
  let date = isDate(data.sjcaTestDate) && formatDate(data.sjcaTestDate) || null;
  let start = isDate(data.sjcaTestStartTime) && formatDate(data.sjcaTestStartTime, 'time') || null;
  let end = isDate(data.sjcaTestEndTime) && formatDate(data.sjcaTestEndTime, 'time') || null;

  if(!date && !start && !end) {
    return null;
  }

  return `${date} - ${start} to ${end}`;
};

const createScenariotest = (data) => {
  let date = isDate(data.scenarioTestDate) && formatDate(data.scenarioTestDate) || null;
  let start = isDate(data.scenarioTestStartTime) && formatDate(data.scenarioTestStartTime, 'time') || null;
  let end = isDate(data.scenarioTestEndTime) && formatDate(data.scenarioTestEndTime, 'time') || null;

  if(!date && !start && !end) {
    return null;
  }

  return `${date} - ${start} to ${end}`;
};

const createSelectionDay = (selectionDay) => {
  let selectionDayEntry = {
    entry: 'Selection Day',
    date: null,
  };
  let selectionDayStart = isDate(selectionDay.selectionDayStart) && formatDate(selectionDay.selectionDayStart) || null;
  let selectionDayEnd = isDate(selectionDay.selectionDayEnd) && formatDate(selectionDay.selectionDayEnd) || null;
  if(!selectionDayStart && !selectionDayEnd) {
    return null;
  } else {
    selectionDayEntry.date = `${selectionDayStart} to ${selectionDayEnd}`;
  }
  return selectionDayEntry;
};

const exerciseTimeline = (data) => {
  let timeline = [];
  timeline.push(
    {
      entry: 'Open for applications',
      date: isDate(data.applicationOpenDate) ? formatDate(data.applicationOpenDate) : null,
    },
    {
      entry: 'Closed for applications',
      date: isDate(data.applicationCloseDate) ? formatDate(data.applicationCloseDate) : null,
    }
  );

  if (data.shortlistingMethods) {
    timeline.push(
      {
        entry: 'Shortlisting',
      },
    );
  }

  if(data.shortlistingMethods.includes('paper-sift')) {
    timeline.push(
      {
        entry: 'Sift date',
        date: isDate(data.siftDate) ? formatDate(data.siftDate) : null,
      },
    );
  }

  if(data.shortlistingMethods.includes('name-blind-paper-sift')) {
    timeline.push(
      {
        entry: 'Name-blind sift date',
        date: isDate(data.nameBlindSiftDate) ? formatDate(data.nameBlindSiftDate) : null,
      },
    );
  }

  if(data.shortlistingMethods.includes('telephone-assessment')) {
    timeline.push(
      {
        entry: 'Telephone assessment date',
        date: isDate(data.telephoneAssessmentDate) ? formatDate(data.telephoneAssessmentDate) : null,
      },
    );
  }

  if (data.shortlistingOutcomeDate) {
    timeline.push(
      {
        entry: 'Shortlisting outcome date',
        date: isDate(data.shortlistingOutcomeDate) ? formatDate(data.shortlistingOutcomeDate) : null,
      },
    );
  }

  timeline.push(
    {
      entry: 'QT',
      date: createQT(data),
    },
    {
      entry: 'QT outcome to candidates',
      date: isDate(data.sjcaTestOutcome) ? formatDate(data.sjcaTestOutcome, 'month') : null,
    },
    {
      entry: 'Scenario test',
      date: createScenariotest(data),
    },
    {
      entry: 'Scenario test outcome to candidates',
      date: isDate(data.scenarioTestOutcome) ? formatDate(data.scenarioTestOutcome) : null,
    },
    {
      entry: 'Contact independent assessors',
      date: isDate(data.contactIndependentAssessors) ? formatDate(data.contactIndependentAssessors) : null,
    },
    {
      entry: 'Return date for independent assessments',
      date: isDate(data.independentAssessmentsReturnDate) ? formatDate(data.independentAssessmentsReturnDate) : null,
    },
    {
      entry: 'Eligibility SCC',
      date: isDate(data.eligibilitySCCDate) ? formatDate(data.eligibilitySCCDate) : null,
    }
  );

  for (var i = 0; i < data.selectionDays.length; i++) {
    timeline.push(createSelectionDay(data.selectionDays[i]));
  }
  timeline.push(
    {
      entry: 'Character checks',
      date: isDate(data.characterChecksDate) ? formatDate(data.characterChecksDate) : null,
    },
    {
      entry: 'Statutory consultation',
      date: isDate(data.statutoryConsultationDate) ? formatDate(data.statutoryConsultationDate) : null,
    },
    {
      entry: 'Character and Selection SCC',
      date: isDate(data.characterAndSCCDate) ? formatDate(data.characterAndSCCDate) : null,
    },
    {
      entry: 'Selection process outcome',
      date: isDate(data.finalOutcome) ? formatDate(data.finalOutcome, 'month') : null,
    }
  );
    return timeline;
};

export default exerciseTimeline;
