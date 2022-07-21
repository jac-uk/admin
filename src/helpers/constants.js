import {
  STATUS,
  // EXERCISE_STAGE,
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

const EXERCISE_STAGE = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  SELECTABLE: 'selectable',
  RECOMMENDED: 'recommended',
  HANDOVER: 'handover',
};

const APPLICATION_STATUS = {
  QUALIFYING_TEST_PASSED: 'qualifyingTestPassed',
  QUALIFYING_TEST_FAILED: 'qualifyingTestFailed',
  SCENARIO_TEST_PASSED: 'scenarioTestPassed',
  SCENARIO_TEST_FAILED: 'scenarioTestFailed',
  SIFT_PASSED: 'siftPassed',
  SIFT_FAILED: 'siftFailed',
  SELECTION_INVITED: 'selectionInvited',
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

const TASK_TYPE = {
  SIFT: 'sift',
  SELECTION: 'selection',
  SCENARIO: 'scenario',
  CRITICAL_ANALYSIS: 'criticalAnalysis',
  SITUATIONAL_JUDGEMENT: 'situationalJudgement',
  QUALIFYING_TEST: 'qualifyingTest',
};

export {
  STATUS,
  EXERCISE_STAGE,
  APPLICATION_STATUS,
  TASK_TYPE,
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  ADVERT_TYPES,
  DEFAULT
};
