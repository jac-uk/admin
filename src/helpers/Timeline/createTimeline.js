import formatDate from '@/helpers/formatDate';

const isTimeEntry = (date) => {
  console.log(new Date(date).getFullYear());
  return date;
}

const timelineEvents = {
  "scenarioTestEndTime": 'Scenario test',
  "scenarioTestStartTime": 'Scenario test',
  "sjcaTestStartTime": 'QT',
  "sjcaTestEndTime": 'QT',
  "sjcaTestDate": 'QT',
  "characterChecks": 'Character checks',
  "statutoryConsultation": 'Statutory consultation',
  "applicationOpenDate": "Open for applications",
  "contactIndependentAssessors": 'Contact independent assessors',
  "scenarioTestDate": 'Scenario test',
  "applicationCloseDate": 'Closed for applications',
  "finalOutcome": 'Selection process outcome',
  "sjcaTestOutcome": 'QT outcome to candidates',
  "scenarioTestOutcome": 'Scenario test outcome to candidates'
};

const formatEntry = (entry) => {
  if(entry.name === sjcaTestStartTime)

  return formatDate(entry);
}

const findAll = (array, event) => {
  let all = array.map((item) => item[name].includes(event));
}

const createTimeline = (data) => {
  let dates = [];
  for (let [key, value] of Object.entries(data)) {
    if(value instanceof Date) {
      dates.push({name: key, date: isTimeEntry(value)});
    }
  }

  dates.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  });

  console.log("DATES: ", dates);

  return dates;
}

export default createTimeline;
