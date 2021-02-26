  const SUPERADMIN = {
    permissions: ['all', 'changeUserRoles'],
  };

  const ADMIN = {
    permissions: ['createExercise', 'viewExercise', 'updateExercise', 'deleteExercise', 'updateExerciseDatesAfterClose',
                'updateApplication', 'updateCandidateContactDetails', 'candidateSearch', 'updateAssessorsDetails',
                'createReports', 'triggerEmails', 'updateStateByActions', 'addNotes', 'uploadTemplates'],
  };

  const MANAGER = {
    permissions: ['createExercise', 'viewExercise','updateExercise', 'deleteExercise', 'updateExerciseDatesAfterClose',
                'updateApplication', 'updateCandidateContactDetails', 'candidateSearch', 'updateAssessorsDetails',
                'createReports', 'triggerEmails', 'updateStateByActions', 'addNotes', 'uploadTemplates', 'signOffExercise',
                'reviewDiversity', 'signOffDiversity'],
                };

  const CANDIDATE = {
      permissions: ['createAccount', 'updatePersonalDetails', 'createApplication', 'saveApplication', 'viewApplication',
                  'updateApplication', 'viewSubmittedApplication', 'downloadSubmittedApplication', 'downloadTemplates',
                  'uploadCompletedTemplates'],
  };

  const ASSESSOR = {
    permissions: ['createAccount', 'downloadTemplates', 'uploadCompletedTemplates', 'viewSubmittedTemplates'],
  };

  const PANEL = {
    permissions: ['viewModifiedApplication', 'filterApplicants'],
  };

  const COMMISSIONER = {
      permissions: ['viewModifiedApplication', 'filterApplicants'],
  };

  const USER = {
    permissions: [],
  };

  export const ROLES = {
    SUPERADMIN: SUPERADMIN,
    ADMIN: ADMIN,
    MANAGER: MANAGER,
    CANDIDATE: CANDIDATE,
    PANEL: PANEL,
    ASSESSOR: ASSESSOR,
    COMMISSIONER: COMMISSIONER,
    USER: USER,
};

