const mockScenarioResponses = {
  responsesForScenario: [
    {
      completed: new Date('November 6, 2020 at 1:11:43 AM UTC'),
      started: new Date('October 29, 2020 at 4:20:20 PM UTC'),
      text: '',
    },
    {
      completed: new Date('October 29, 2020 at 4:42:09 PM UTC'),
      started: new Date('October 29, 2020 at 4:42:04 PM UTC'),
      text: 'dsdada',
    },
    {
      completed: null,
      started: new Date('November 6, 2020 at 1:11:47 AM UTC'),
      text: null,
    },
    {
      completed: new Date('October 29, 2020 at 4:42:13 PM UTC'),
      started: new Date('October 29, 2020 at 4:42:11 PM UTC'),
      text: 'dasdsasd',
    },
  ],
};

const mockScenarioQualifyingTest = {
  additionalInstructions: [
    {
      text: 'Additional instructions',
    },
  ],
  counts: {
    activated: 1,
    completed: 0,
    inProgress: 0,
    initialised: 1,
    outOfTime: 1,
    started: 1,
  },
  created: new Date('October 21, 2020 at 10:38:20 AM UTC+1'),
  endDate: new Date('November 29, 2020 at 9:00:00 PM UTC'),
  feedbackSurvey: null,
  lastUpdated: new Date('October 21, 2020 at 10:41:19 AM UTC+1'),
  startDate: new Date('October 20, 2020 at 7:00:00 AM UTC+1'),
  status: 'activated',
  testDuration: 60,
  testQuestions: {
    introduction: 'Intro',
    questions: [
      {
        documents: [
          {
            content: '<p>doc1</p>',
            title: 'Doc 1',
          },
        ],
        options: [
          {
            hint: '1',
            question: 'One',
            wordLimit: 50,
          },
          {
            hint: '2',
            question: 'Two',
            wordLimit: 50,
          },
          {
            hint: '3',
            question: 'Three',
            wordLimit: 50,
          },
          {
            hint: '4',
            question: 'Four',
            wordLimit: 50,
          },
        ],
      },
      {
        documents: [
          {
            content: '<p>doc2</p>',
            title: 'Doc 2',
          },
        ],
        options: [
          {
            question: 'Q1',
            wordLimit: 50,
          },
          {
            question: 'q2',
            wordLimit: 50,
          },
          {
            question: 'q3',
            wordLimit: 50,
          },
          {
            question: 'q4',
            wordLimit: 50,
          },
        ],
      },
    ], 
  },
  title: 'lots of Scenarios example',
  type: 'scenario',
  vacancy: {
    contactPhone: '0---------5',
    id: 'GIIXvf2Pp0hMVIdEcfor',
    name: 'mock ex',
    referenceNumber: 'JAC0000',
  },
};

const mockScenarioQualifyingTestResponse = {
  application: {
    id: 'NakT3TG1IM0tAbuscKYQ',
    referenceNumber: 'JAC00134-orp0002',
  },
  candidate: {
    fullName: 'Thomas RRRRRRRRRRRR',
    id: 'yBAk1vGgkleGRYB4qwAfaSfRqrC3',
  },
  reasonableAdjustments: false,
  reasonableAdjustmentsDetails: null,
  duration: {
    reasonableAdjustment: 0,
    testDuration: 60,
    testDurationAdjusted: 60,
  },
  lastUpdated: new Date('November 6, 2020 at 4:58:30 PM UTC'),
  qualifyingTest: {
    additionalInstructions: [
      {
        text: 'Additional instructions',
      },
    ],
    endDate: new Date('November 29, 2020 at 9:00:00 PM UTC'),
    feedbackSurvey: null,
    id: 'some_id',
    startDate: new Date('October 20, 2020 at 7:00:00 AM UTC+1'),
    title: 'lots of Scenarios example copy',
    type: 'scenario',
  },
  responses: [],
  status: 'started',
  statusLog: {
    activated: new Date('November 6, 2020 at 4:57:53 PM UTC'),
    completed: null,
    created: new Date('November 6, 2020 at 12:00:00 AM UTC'),
    started: new Date('November 6, 2020 at 4:58:12 PM UTC'),
  },
  testQuestions: {
    introduction: 'Intro',
    questions: [
      {
        documents: [
          {
            content: '<p>doc1</p>',
            title: 'Doc 1',
          },
        ],
        options: [
          {
            hint: '1',
            question: 'One',
            wordLimit: 50,
          },
          {
            hint: '2',
            question: 'Two',
            wordLimit: 50,
          },
          {
            hint: '3',
            question: 'Three',
            wordLimit: 50,
          },
          {
            hint: '4',
            question: 'Four',
            wordLimit: 50,
          },
        ],
      },
    ],
  },
  vacancy: {
    id: 'GIIXvf2Pp0hMVIdEcfor',
  },
};

export {
  mockScenarioResponses,
  mockScenarioQualifyingTest,
  mockScenarioQualifyingTestResponse
};
