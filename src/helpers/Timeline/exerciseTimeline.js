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

const createSelectionDay = (data) => {
  let selectionDayStart = data.selectionDays && data.selectionDays[0] && isDate(data.selectionDays[0].selectionDayStart) && formatDate(data.selectionDays[0].selectionDayStart) || null;
  let selectionDayEnd = data.selectionDays && data.selectionDays[0] && isDate(data.selectionDays[0].selectionDayEnd) && formatDate(data.selectionDays[0].selectionDayEnd) || null;

  if(!selectionDayStart && !selectionDayEnd) {
    return null;
  }

  return `${selectionDayStart} to ${selectionDayEnd}`;
};

const exerciseTimeline = (data) => {
  return [
  {
    entry: 'Open for applications',
    date: isDate(data.applicationOpenDate) ? formatDate(data.applicationOpenDate) : null,
  },
  {
    entry: 'Closed for applications',
    date: isDate(data.applicationCloseDate) ? formatDate(data.applicationCloseDate) : null,
  },
  {
    entry: 'Shortlisting',
  },
  {
    entry: 'Sift date',
    date: isDate(data.siftDate) ? formatDate(data.siftDate) : null,
  },
  {
    entry: 'Name-blind sift date',
    date: isDate(data.nameBlindSiftDate) ? formatDate(data.nameBlindSiftDate) : null,
  },
  {
    entry: 'Telephone assessment date',
    date: isDate(data.telephoneAssessmentDate) ? formatDate(data.telephoneAssessmentDate) : null,
  },
  {
    entry: 'Shortlisting outcome date',
    date: isDate(data.shortlistingOutcomeDate) ? formatDate(data.shortlistingOutcomeDate) : null,
  },
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
  },
  {
    entry: 'Selection day',
    date: createSelectionDay(data),
  },
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
  }];
};

export default exerciseTimeline;
