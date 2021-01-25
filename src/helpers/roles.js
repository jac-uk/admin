export const roles = {
  superadmin: ['createExercise', 'viewExercise', 'updateExercise', 'deleteExercise', 'resetQT'], // or ['all'] ?
  admin: ['createExercise', 'viewExercise','updateExercise', 'deleteExercise', 'updateExerciseDatesAfterClose', 'updateApplication',
      'updateCandidateContactDetails', 'candidateSearch', 'updateAssessorsDetails', 'createReports', 'triggerEmails',
      'updateStateByActions', 'addNotes', 'uploadTemplates'],
  manager: ['createExercise', 'viewExercise','updateExercise', 'deleteExercise', 'updateExerciseDatesAfterClose', 'updateApplication',
      'updateCandidateContactDetails', 'candidateSearch', 'updateAssessorsDetails', 'createReports', 'triggerEmails',
      'updateStateByActions', 'addNotes', 'uploadTemplates', 'signOffExercise', 'reviewDiversity', 'signOffDiversity'],
  candidate: ['createAccount', 'updatePersonalDetails', 'createApplication', 'saveApplication', 'viewApplication', 'updateApplication',
      'viewSubmittedApplication', 'downloadSubmittedApplication', 'downloadTemplates', 'uploadCompletedTemplates'],
  assessor: ['createAccount', 'downloadTemplates', 'uploadCompletedTemplates', 'viewSubmittedTemplates'],
  panel: ['viewModifiedApplication', 'filterApplicants'],
  commissioner: ['viewModifiedApplication', 'filterApplicants'],
};
