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
  REVIEW: 'review', // to be replaced with applied
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  SELECTABLE: 'selectable',
  SELECTED: 'selected', // to be replaced with selectable
  RECOMMENDED: 'recommended',
  HANDOVER: 'handover',
};

const APPLICATION_STATUS = {
  // v2
  CRITICAL_ANALYSIS_PASSED: 'criticalAnalysisPassed',
  CRITICAL_ANALYSIS_FAILED: 'criticalAnalysisFailed',
  SITUATIONAL_JUDGEMENT_PASSED: 'situationalJudgementPassed',
  SITUATIONAL_JUDGEMENT_FAILED: 'situationalJudgementFailed',
  QUALIFYING_TEST_PASSED: 'qualifyingTestPassed',
  QUALIFYING_TEST_FAILED: 'qualifyingTestFailed',
  QUALIFYING_TEST_NOT_SUBMITTED: 'noTestSubmitted',
  SCENARIO_TEST_PASSED: 'scenarioTestPassed',
  SCENARIO_TEST_FAILED: 'scenarioTestFailed',
  SCENARIO_TEST_NOT_SUBMITTED: 'noScenarioTestSubmitted',
  SIFT_PASSED: 'siftPassed',
  SIFT_FAILED: 'siftFailed',
  TELEPHONE_ASSESSMENT_PASSED: 'telephoneAssessmentPassed',
  TELEPHONE_ASSESSMENT_FAILED: 'telephoneAssessmentFailed',
  SHORTLISTING_PASSED: 'shortlistingOutcomePassed',
  SHORTLISTING_FAILED: 'shortlistingOutcomeFailed',
  ELIGIBILITY_SCC_PASSED: 'eligibilitySCCPassed',
  ELIGIBILITY_SCC_FAILED: 'eligibilitySCCFailed',
  CHARACTER_AND_SELECTION_SCC_PASSED: 'characterAndSelectionSCCPassed',
  CHARACTER_AND_SELECTION_SCC_FAILED: 'characterAndSelectionSCCFailed',
  STATUTORY_CONSULTATION_PASSED: 'statutoryConsultationPassed',
  STATUTORY_CONSULTATION_FAILED: 'statutoryConsultationFailed',
  SELECTION_INVITED: 'selectionInvited',
  REJECTED_INELIGIBLE_STATUTORY: 'rejectedIneligibleStatutory',
  REJECTED_INELIGIBLE_ADDITIONAL: 'rejectedIneligibleAdditional',
  REJECTED_CHARACTER: 'rejectedCharacter',
  SELECTION_DAY_PASSED: 'selectionDayPassed',
  SELECTION_DAY_FAILED: 'selectionDayFailed',
  SELECTION_PASSED: 'selectionOutcomePassed',
  SELECTION_FAILED: 'selectionOutcomeFailed',
  SELECTION_OUTCOME_PASSED: 'selectionOutcomePassed',
  SELECTION_OUTCOME_FAILED: 'selectionOutcomeFailed',
  PASSED_RECOMMENDED: 'passedRecommended',
  PASSED_NOT_RECOMMENDED: 'passedNotRecommended',
  RECOMMENDED_IMMEDIATE: 'recommendedImmediate',
  RECOMMENDED_FUTURE: 'recommendedFuture',
  RECONSIDER: 'reconsider',
  SECOND_STAGE_INVITED: 'secondStageInvited',
  WITHDRAWN: 'withdrawn',

  // v1 REVIEW
  PASSED_SIFT: 'passedSift',
  FAILED_SIFT: 'failedSift',
  SUBMITTED_FIRST_TEST: 'submittedFirstTest',
  FAILED_FIRST_TEST: 'failedFirstTest',
  SUBMITTED_SCENARIO_TEST: 'submittedScenarioTest',
  PASSED_FIRST_TEST: 'passedFirstTest',
  FAILED_SCENARIO_TEST: 'failedScenarioTest',
  PASSED_SCENARIO_TEST: 'passedScenarioTest',
  FAILED_TELEPHONE_ASSESSMENT: 'failedTelephoneAssessment',
  PASSED_TELEPHONE_ASSESSMENT: 'passedTelephoneAssessment',
  NO_TEST_SUBMITTED: 'noTestSubmitted',
  TEST_SUBMITTED_OVER_TIME: 'testSubmittedOverTime',
  WITHDREW_APPLICATION: 'withdrewApplication',
  REJECTED_AS_INELIGIBLE: 'rejectedAsIneligible',
  // v1 SHORTLISTED
  INVITED_TO_SELECTION_DAY: 'invitedToSelectionDay',
  // v1 SELECTED
  PASSED_SELECTION: 'passedSelection',
  FAILED_SELECTION: 'failedSelection',
  PASSED_BUT_NOT_RECOMMENDED: 'passedButNotRecommended',
  // v1 RECOMMENDED
  REJECTED_BY_CHARACTER: 'rejectedByCharacter',
  APPROVED_FOR_IMMEDIATE_APPOINTMENT: 'approvedForImmediateAppointment',
  APPROVED_FOR_FUTURE_APPOINTMENT: 'approvedForFutureAppointment',
  SCC_TO_RECONSIDER: 'sccToReconsider',
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
  SELECTION_DAY: 'selectionDay',
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
  EMP_TIEBREAKER: 'empTiebreaker',
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

const TASK_QT_MAP = {};
TASK_QT_MAP[TASK_TYPE.CRITICAL_ANALYSIS] = QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS;
TASK_QT_MAP[TASK_TYPE.SITUATIONAL_JUDGEMENT] = QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT;
TASK_QT_MAP[TASK_TYPE.SCENARIO] = QUALIFYING_TEST.TYPE.SCENARIO;

const ASSESSMENT_METHOD = {
  SELF_ASSESSMENT_WITH_COMPETENCIES: 'selfAssessmentWithCompetencies',
  COVERING_LETTER: 'coveringLetter',
  CV: 'cv',
  STATEMENT_OF_SUITABILITY_WITH_COMPETENCIES: 'statementOfSuitabilityWithCompetencies',
  STATEMENT_OF_SUITABILITY_WITH_SKILLS_AND_ABILITIES: 'statementOfSuitabilityWithSkillsAndAbilities',
  STATEMENT_OF_ELIGIBILITY: 'statementOfEligibility',
  INDEPENDENT_ASSESSMENTS: 'independentAssessments',
  LEADERSHIP_JUDGE_ASSESSMENT: 'leadershipJudgeAssessment',
};

export {
  STATUS,
  EXERCISE_STAGE,
  APPLICATION_STATUS,
  APPLICATION_SUCCESS_STATUSES,
  TASK_TYPE,
  TASK_QT_MAP,
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  ADVERT_TYPES,
  DEFAULT,
  INDEPENDENT_ASSESSMENTS_STATUS,
  ASSESSOR_TYPES,
  OFFENCE_CATEGORY,
  ASSESSMENT_METHOD
};

// end
