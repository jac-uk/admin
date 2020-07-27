import { isDate, formatDate } from '@/helpers/date';

const getDateString = (date, format) => {
  return isDate(date) ? formatDate(date, format) : null;
};

const getDateAndTime = (date, startTime) => {
  if (!isDate(date) && !isDate(startTime)) {
    return null;
  }
  const result = date;
  result.setHours(startTime.getHours(), startTime.getMinutes());

  return result;
};

const getDateAndTimeString = (date, startTime, endTime) => {
  const dateString = getDateString(date);
  const startTimeString = getDateString(startTime, 'time');
  const endTimeString = getDateString(endTime, 'time');

  if (!dateString && !startTimeString && !endTimeString) {
    return null;
  }

  return `${dateString} - ${startTimeString} to ${endTimeString}`;
};

const createSelectionDay = (selectionDay) => {
  const selectionDayEntry = {
    entry: `Selection Day - ${  selectionDay.selectionDayLocation}`,
    date: selectionDay.selectionDayStart,
    dateString: null,
  };
  
  const selectionDayStart = getDateString(selectionDay.selectionDayStart);
  const selectionDayEnd = getDateString(selectionDay.selectionDayEnd);

  if (!selectionDayStart || !selectionDayEnd) {
    selectionDayEntry.dateString = '';
  } else if (selectionDayStart !== selectionDayEnd) {
    selectionDayEntry.dateString = `${selectionDayStart} to ${selectionDayEnd}`;
  } else {
    selectionDayEntry.dateString = `${selectionDayStart}`;
  }
  return selectionDayEntry;
};

const createShortlistingMethod = (method, startDate, endDate) => {
  const shortlistingMethodEntry = {
    entry: `${method}`,
    date: startDate,
    dateString: null,
  };

  const formattedStartDate = getDateString(startDate);
  const formattedEndDate = getDateString(endDate);

  if (!formattedStartDate || !formattedEndDate) {
    shortlistingMethodEntry.dateString = '';
  } else if (formattedStartDate !== formattedEndDate) {
    shortlistingMethodEntry.dateString = `${formattedStartDate} to ${formattedEndDate}`;
  } else {
    shortlistingMethodEntry.dateString = `${formattedStartDate}`;
  }

  return shortlistingMethodEntry;
};

const exerciseTimeline = (data) => {
  const timeline = [];

  if (data.applicationOpenDate) {
    timeline.push(
      {
        entry: 'Open for applications',
        date: data.applicationOpenDate,
        dateString: getDateString(data.applicationOpenDate),
      },
    );
  }

  if (data.applicationCloseDate) {
    timeline.push(
      {
        entry: 'Closed for applications',
        date: data.applicationCloseDate,
        dateString: getDateString(data.applicationCloseDate),
      }
    );
  }

  if (data.shortlistingMethods && data.shortlistingMethods.length > 0) {
    if (data.shortlistingOutcomeDate) {
      timeline.push(
        {
          entry: 'Shortlisting outcome',
          date: data.shortlistingOutcomeDate,
          dateString: getDateString(data.shortlistingOutcomeDate, 'month'),
        },
      );
    }

    if (data.shortlistingMethods.includes('paper-sift')) {
      timeline.push(
        createShortlistingMethod('Sift', data.siftStartDate, data.siftEndDate)
      );
    }

    if (data.shortlistingMethods.includes('name-blind-paper-sift')) {
      timeline.push(
        createShortlistingMethod('Name-blind sift', data.nameBlindSiftStartDate, data.nameBlindSiftEndDate)
      );
    }

    if (data.shortlistingMethods.includes('telephone-assessment')) {
      timeline.push(createShortlistingMethod('Telephone assessment', data.telephoneAssessmentStartDate, data.telephoneAssessmentEndDate));
    }

    if (data.shortlistingMethods.includes('situational-judgement-qualifying-test')) {
      if (data.situationalJudgementTestDate) {
        timeline.push(
          {
            entry: 'Situational judgement qualifying test (QT)',
            date: getDateAndTime(data.situationalJudgementTestDate, data.situationalJudgementTestStartTime),
            dateString: getDateAndTimeString(data.situationalJudgementTestDate, data.situationalJudgementTestStartTime, data.situationalJudgementTestEndTime),
          },
        );
      }
      if (data.situationalJudgementTestOutcome) {
        timeline.push(
          {
            entry: 'Situational judgement QT outcome to candidates',
            date: data.situationalJudgementTestOutcome,
            dateString: getDateString(data.situationalJudgementTestOutcome),
          },
        );
      }
    }

    if (data.shortlistingMethods.includes('critical-analysis-qualifying-test')) {
      if (data.criticalAnalysisTestDate) {
        timeline.push(
          {
            entry: 'Critical analysis qualifying test (QT)',
            date: getDateAndTime(data.criticalAnalysisTestDate, data.criticalAnalysisTestStartTime),
            dateString: getDateAndTimeString(data.criticalAnalysisTestDate, data.criticalAnalysisTestStartTime, data.criticalAnalysisTestEndTime),
          },
        );
      }
      if (data.criticalAnalysisTestOutcome) {
        timeline.push(
          {
            entry: 'Critical analysis QT outcome to candidates',
            date: data.criticalAnalysisTestOutcome,
            dateString: getDateString(data.criticalAnalysisTestOutcome),
          },
        );
      }
    }

    if (data.shortlistingMethods.includes('scenario-test-qualifying-test')) {
      if (data.scenarioTestDate) {
        timeline.push(
          {
            entry: 'Scenario test',
            date: getDateAndTime(data.scenarioTestDate, data.scenarioTestStartTime),
            dateString: getDateAndTimeString(data.scenarioTestDate, data.scenarioTestStartTime, data.scenarioTestEndTime),
          },
        );
      }
      if (data.scenarioTestOutcome) {
        timeline.push(
          {
            entry: 'Scenario test outcome to candidates',
            date: data.scenarioTestOutcome,
            dateString: getDateString(data.scenarioTestOutcome),
          },
        );
      }
    }    
  }

  if (data.contactIndependentAssessors) {
    timeline.push(
      {
        entry: 'JAC Contacts Independent Assessors',
        date: data.contactIndependentAssessors,
        dateString: getDateString(data.contactIndependentAssessors),
      },
    );
  }

  if (data.independentAssessmentsReturnDate) {
    timeline.push(
      {
        entry: 'Return date for independent assessments',
        date: data.independentAssessmentsReturnDate,
        dateString: getDateString(data.independentAssessmentsReturnDate),
      },
    );
  }

  if (data.eligibilitySCCDate) {
    timeline.push(
      {
        entry: 'Eligibility SCC',
        date: data.eligibilitySCCDate,
        dateString: getDateString(data.eligibilitySCCDate),
      },
    );
  }
  if (data.selectionDays && data.selectionDays.length > 0) {
    for (let i = 0; i < data.selectionDays.length; i++) {
      if (data.selectionDays[i].selectionDayStart) {
        timeline.push(createSelectionDay(data.selectionDays[i]));
      }
    }
  }

  if (data.characterChecksDate) {
    timeline.push(
      {
        entry: 'Character Checks',
        date: data.characterChecksDate,
        dateString: getDateString(data.characterChecksDate),
      },
    );
  }

  if (data.characterChecksReturnDate) {
    timeline.push(
      {
        entry: 'Character Checks return',
        date: data.characterChecksReturnDate,
        dateString: getDateString(data.characterChecksReturnDate),
      },
    );
  }

  if (data.statutoryConsultationDate) {
    timeline.push(
      {
        entry: 'Statutory consultation',
        date: data.statutoryConsultationDate,
        dateString: getDateString(data.statutoryConsultationDate),
      },
    );
  }

  if (data.characterAndSCCDate) {
    timeline.push(
      {
        entry: 'Character and Selection SCC',
        date: data.characterAndSCCDate,
        dateString: getDateString(data.characterAndSCCDate),
      },
    );
  }

  if (data.finalOutcome) {
    timeline.push(
      {
        entry: 'Selection process outcome',
        date: data.finalOutcome,
        dateString: getDateString(data.finalOutcome),
      }
    );
  }

  if (data.equalMeritSecondStageStartDate) {
    timeline.push(
      createShortlistingMethod('Equal merit second stage', data.equalMeritSecondStageStartDate, data.equalMeritSecondStageEndDate)
    );
  }

  if (data.eMPSCCDate) {
    timeline.push(
      {
        entry: 'EMP SCC',
        date: data.eMPSCCDate,
        dateString: getDateString(data.eMPSCCDate),
      }
    );
  }

  if (data.eMPOutcomeDate) {
    timeline.push(
      {
        entry: 'EMP Outcomes',
        date: data.eMPOutcomeDate,
        dateString: getDateString(data.eMPOutcomeDate),
      }
    );
  }

  return timeline;
};

export default exerciseTimeline;
