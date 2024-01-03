export const searchMap = {
  exercises: {
    title: 'Search exercises',
    tooltip: {
      visible: ['Name', 'Reference number'],
      hidden: [],
    },
  },
  users: {
    title: 'Search users',
    tooltip: {
      visible: ['Display Name', 'Email'],
      hidden: [],
    },
  },
  candidates: {
    title: 'Search candidates',
    tooltip: {
      visible: ['Name', 'Reference number', 'Email', 'NI Number'],
      hidden: ['Reference number', 'Email', 'NI Number'],
    },
  },
  applications: {
    title: 'Search applications',
    tooltip: {
      visible: ['Name', 'Reference number', 'Email', 'NI Number'],
      hidden: ['Email', 'NI Number'],
    },
  },
  applicationRecords: {
    title: 'Search application records',
    tooltip: {
      visible: ['Name', 'Reference number', 'Email', 'NI Number'],
      hidden: ['Email', 'NI Number'],
    },
  },
  characterChecks: {
    title: 'Search character checks',
    tooltip: {
      visible: ['Name', 'Reference number', 'Email', 'NI Number'],
      hidden: ['Email', 'NI Number'],
    },
  },
  independentAssessments: {
    title: 'Search independent assessments',
    tooltip: {
      visible: ['Assessor Name', 'Assessor Email', 'Candidate Name', 'Reference number', 'Candidate Email'],
      hidden: ['Assessor Email', 'Candidate Email'],
    },
  },
};
