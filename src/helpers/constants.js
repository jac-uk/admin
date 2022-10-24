import {
  STATUS,
  EXERCISE_STAGE,
  // APPLICATION_STATUS,
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  // ADVERT_TYPES,
  DEFAULT
} from '@jac-uk/jac-kit/helpers/constants';

const ADVERT_TYPES = {
  LISTING: 'listing',
  BASIC: 'basic',
  FULL: 'full',
  EXTERNAL: 'external',
};

// const EXERCISE_STAGE = {
//   APPLIED: 'applied',
//   SHORTLISTED: 'shortlisted',
//   SELECTABLE: 'selectable',
//   RECOMMENDED: 'recommended',
//   HANDOVER: 'handover',
// };

const APPLICATION_STATUS = {
  CRITICAL_ANALYSIS_PASSED: 'criticalAnalysisPassed',
  CRITICAL_ANALYSIS_FAILED: 'criticalAnalysisFailed',
  SITUATIONAL_JUDGEMENT_PASSED: 'situationalJudgementPassed',
  SITUATIONAL_JUDGEMENT_FAILED: 'situationalJudgementFailed',
  QUALIFYING_TEST_PASSED: 'qualifyingTestPassed',
  QUALIFYING_TEST_FAILED: 'qualifyingTestFailed',
  SCENARIO_TEST_PASSED: 'scenarioTestPassed',
  SCENARIO_TEST_FAILED: 'scenarioTestFailed',
  SIFT_PASSED: 'siftPassed',
  SIFT_FAILED: 'siftFailed',
  TELEPHONE_ASSESSMENT_PASSED: 'telephoneAssessmentPassed',
  TELEPHONE_ASSESSMENT_FAILED: 'telephoneAssessmentFailed',
  ELIGIBILITY_SCC_PASSED: 'eligibilitySCCPassed',
  // SELECTION_INVITED: 'selectionInvited',
  REJECTED_INELIGIBLE_STATUTORY: 'rejectedIneligibleStatutory',
  REJECTED_INELIGIBLE_ADDITIONAL: 'rejectedIneligibleAdditional',
  REJECTED_CHARACTER: 'rejectedCharacter',
  WITHDRAWN: 'withdrawn',
  SELECTION_PASSED: 'selectionPassed',
  SELECTION_FAILED: 'selectionFailed',
  PASSED_RECOMMENDED: 'passedRecommended',
  PASSED_NOT_RECOMMENDED: 'passedNotRecommended',
  RECOMMENDED_IMMEDIATE: 'recommendedImmediate',
  RECOMMENDED_FUTURE: 'recommendedFuture',
  RECONSIDER: 'reconsider',
  SECOND_STAGE_INVITED: 'secondStageInvited',
};

const APPLICATION_SUCCESS_STATUSES = [
  APPLICATION_STATUS.CRITICAL_ANALYSIS_PASSED,
  APPLICATION_STATUS.SITUATIONAL_JUDGEMENT_PASSED,
  APPLICATION_STATUS.QUALIFYING_TEST_PASSED,
  APPLICATION_STATUS.SCENARIO_TEST_PASSED,
  APPLICATION_STATUS.SIFT_PASSED,
  APPLICATION_STATUS.TELEPHONE_ASSESSMENT_PASSED,
  APPLICATION_STATUS.ELIGIBILITY_SCC_PASSED,
  APPLICATION_STATUS.SELECTION_PASSED,
  APPLICATION_STATUS.PASSED_RECOMMENDED,
  APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
  APPLICATION_STATUS.RECOMMENDED_FUTURE,
  APPLICATION_STATUS.SECOND_STAGE_INVITED,
];

const TASK_TYPE = {
  SIFT: 'sift',
  SELECTION: 'selection',
  SCENARIO: 'scenarioTest',
  CRITICAL_ANALYSIS: 'criticalAnalysis',
  SITUATIONAL_JUDGEMENT: 'situationalJudgement',
  QUALIFYING_TEST: 'qualifyingTest',
  TELEPHONE_ASSESSMENT: 'telephoneAssessment',
  ELIGIBILITY_SCC: 'eligibilitySCC',
  CHARACTER_AND_SELECTION_SCC: 'characterAndSelectionSCC',
  STATUTORY_CONSULTATION: 'statutoryConsultation',
  SHORTLISTING_OUTCOME: 'shortlistingOutcome',
  WELSH_ASSESSMENT: 'welshAssessment',
  SELECTION_OUTCOME: 'selectionOutcome',
};

const INDEPENDENT_ASSESSMENTS_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
  DELETED: 'deleted',
};

const ASSESSOR_TYPES = {
  PROFESSIONAL: 'professional',
  JUDICIAL: 'judicial',
  PERSONAL: 'personal',
};

const OFFENCE_CATEGORY = {
  SINGLE_CRIMINAL_OFFENCE: 'singleCriminalOffence',
  MULTIPLE_CRIMINAL_OFFENCES: 'multipleCriminalOffences',
  SINGLE_MOTORING_OFFENCE: 'singleMotoringOffence',
  MULTIPLE_MOTORING_OFFENCES: 'multipleMotoringOffences',
  SINGLE_FINANCIAL_OFFENCE: 'singleFinancialOffence',
  MULTIPLE_FINANCIAL_OFFENCES: 'multipleFinancialOffences',
  SINGLE_PROFESSIONAL_CONDUCT: 'singleProfessionalConduct',
  MULTIPLE_PROFESSIONAL_CONDUCTS: 'multipleProfessionalConducts',
  SINGLE_OTHER_MATTER: 'singleOtherMatter',
  MULTIPLE_OTHER_MATTERS: 'multipleOtherMatters',
  MIXED: 'mixed',
};

export {
  STATUS,
  EXERCISE_STAGE,
  APPLICATION_STATUS,
  APPLICATION_SUCCESS_STATUSES,
  TASK_TYPE,
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  ADVERT_TYPES,
  DEFAULT,
  INDEPENDENT_ASSESSMENTS_STATUS,
  ASSESSOR_TYPES,
  OFFENCE_CATEGORY
};
