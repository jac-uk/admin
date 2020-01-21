import formatDate from '@/helpers/formatDate';
import isDate from '@/helpers/isDate';

const getDateAndTime = (date, startTime) => {
  if(!isDate(date) && !isDate(startTime)) {
    return null;
  }
  const result = date;
  result.setHours(startTime.getHours(), startTime.getMinutes());
  return result;
};

const getDateAndTimeString = (date, startTime, endTime) => {
  let dateString = isDate(date) && formatDate(date) || null;
  let startTimeString = isDate(startTime) && formatDate(startTime, 'time') || null;
  let endTimeString = isDate(endTime) && formatDate(endTime, 'time') || null;
  if(!dateString && !startTimeString && !endTimeString) {
    return null;
  }
  return `${dateString} - ${startTimeString} to ${endTimeString}`;
};

const createSelectionDay = (selectionDay) => {
  let selectionDayEntry = {
    entry: 'Selection Day - ' + selectionDay.selectionDayLocation,
    date: selectionDay.selectionDayStart,
    dateString: null,
  };
  let selectionDayStart = isDate(selectionDay.selectionDayStart) && formatDate(selectionDay.selectionDayStart) || null;
  let selectionDayEnd = isDate(selectionDay.selectionDayEnd) && formatDate(selectionDay.selectionDayEnd) || null;
  if(!selectionDayStart || !selectionDayEnd) {
    selectionDayEntry.dateString = '';
  } else if(selectionDayStart !== selectionDayEnd) {
    selectionDayEntry.dateString = `${selectionDayStart} to ${selectionDayEnd}`;
  } else {
    selectionDayEntry.dateString = `${selectionDayStart}`;
  }
  return selectionDayEntry;
};

const createShortlistingMethod = (method, startDate, endDate) => {
  let shortlistingMethodEntry = {
    entry: `${method}`,
    date: startDate,
    dateString: null,
  };
  let formattedStartDate = isDate(startDate) && formatDate(startDate) || null;
  let formattedEndDate = isDate(endDate) && formatDate(endDate) || null;
  if(!formattedStartDate || !formattedEndDate) {
    shortlistingMethodEntry.dateString = '';
  } else if(formattedStartDate !== formattedEndDate) {
    shortlistingMethodEntry.dateString = `${formattedStartDate} to ${formattedEndDate}`;
  } else {
    shortlistingMethodEntry.dateString = `${formattedStartDate}`;
  }
  return shortlistingMethodEntry;
};

const exerciseTimeline = (data) => {
  let timeline = [];

  if (data.applicationOpenDate) {
    timeline.push(
      {
        entry: 'Open for applications',
        date: data.applicationOpenDate,
        dateString: isDate(data.applicationOpenDate) ? formatDate(data.applicationOpenDate) : null,
      },
    );
  }

  if (data.applicationCloseDate) {
    timeline.push(
      {
        entry: 'Closed for applications',
        date: data.applicationCloseDate,
        dateString: isDate(data.applicationCloseDate) ? formatDate(data.applicationCloseDate) : null,
      }
    );
  }

  if (data.shortlistingMethods && data.shortlistingMethods.length > 0) {
    // timeline.push(
    //   {
    //     entry: 'Shortlisting',
    //   },
    // );

    if(data.shortlistingMethods.includes('paper-sift')) {
      timeline.push(
        createShortlistingMethod('Sift', data.siftStartDate, data.siftEndDate)
      );
    }

    if(data.shortlistingMethods.includes('name-blind-paper-sift')) {
      timeline.push(
        createShortlistingMethod('Name-blind sift', data.nameBlindSiftStartDate, data.nameBlindSiftEndDate)
      );
    }

    if(data.shortlistingMethods.includes('telephone-assessment')) {
      timeline.push(createShortlistingMethod('Telephone assessment', data.telephoneAssessmentStartDate, data.telephoneAssessmentEndDate));
    }
  }

  if (data.shortlistingOutcomeDate) {
    timeline.push(
      {
        entry: 'Shortlisting outcome',
        date: data.shortlistingOutcomeDate,
        dateString: isDate(data.shortlistingOutcomeDate) ? formatDate(data.shortlistingOutcomeDate, 'month') : null,
      },
    );
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
          dateString: isDate(data.situationalJudgementTestOutcome) ? formatDate(data.situationalJudgementTestOutcome) : null,
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
          dateString: isDate(data.criticalAnalysisTestOutcome) ? formatDate(data.criticalAnalysisTestOutcome) : null,
        },
      );
    }
  }  

  if (data.shortlistingMethods.includes('scenario-test')) {
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
          dateString: isDate(data.scenarioTestOutcome) ? formatDate(data.scenarioTestOutcome) : null,
        },
      );
    }  
  }

  if (data.contactIndependentAssessors) {
    timeline.push(
      {
        entry: 'JAC Contacts Independent Assessors',
        date: data.contactIndependentAssessors,
        dateString: isDate(data.contactIndependentAssessors) ? formatDate(data.contactIndependentAssessors) : null,
      },
    );
  }

  if (data.independentAssessmentsReturnDate) {
    timeline.push(
      {
        entry: 'Return date for independent assessments',
        date: data.independentAssessmentsReturnDate,
        dateString: isDate(data.independentAssessmentsReturnDate) ? formatDate(data.independentAssessmentsReturnDate) : null,
      },
    );
  }

  if (data.eligibilitySCCDate) {
    timeline.push(
      {
        entry: 'Eligibility SCC',
        date: data.eligibilitySCCDate,
        dateString: isDate(data.eligibilitySCCDate) ? formatDate(data.eligibilitySCCDate) : null,
      },
    );
  }
  if (data.selectionDays && data.selectionDays.length > 0) {
    for (var i = 0; i < data.selectionDays.length; i++) {
      if (data.selectionDays[i].selectionDayStart) {
        timeline.push(createSelectionDay(data.selectionDays[i]));
      }
    }
  }

  if (data.characterChecksDate) {
    timeline.push(
      {
        entry: 'Character checks',
        date: data.characterChecksDate,
        dateString: isDate(data.characterChecksDate) ? formatDate(data.characterChecksDate) : null,
      },
    );
  }

  if (data.statutoryConsultationDate) {
    timeline.push(
      {
        entry: 'Statutory consultation',
        date: data.statutoryConsultationDate,
        dateString: isDate(data.statutoryConsultationDate) ? formatDate(data.statutoryConsultationDate) : null,
      },
    );
  }

  if (data.characterAndSCCDate) {
    timeline.push(
      {
        entry: 'Character and Selection SCC',
        date: data.characterAndSCCDate,
        dateString: isDate(data.characterAndSCCDate) ? formatDate(data.characterAndSCCDate) : null,
      },
    );
  }

  if (data.finalOutcome) {
    timeline.push(
      {
        entry: 'Selection process outcome',
        date: data.finalOutcome,
        dateString: isDate(data.finalOutcome) ? formatDate(data.finalOutcome, 'month') : null,
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
        dateString: isDate(data.eMPSCCDate) ? formatDate(data.eMPSCCDate) : null,
      }
    );
  }

  if (data.eMPOutcomeDate) {
    timeline.push(
      {
        entry: 'EMP Outcomes',
        date: data.eMPOutcomeDate,
        dateString: isDate(data.eMPOutcomeDate) ? formatDate(data.eMPOutcomeDate, 'month') : null,
      }
    );
  }

  return timeline;
};

export default exerciseTimeline;
