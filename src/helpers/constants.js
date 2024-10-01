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
  // v2
  SHORTLISTING: 'shortlisting',
  SELECTION: 'selection',
  SCC: 'scc',
  RECOMMENDATION: 'recommendation',

  // v2 proposed but then removed
  APPLIED: 'applied', // to be removed
  SELECTABLE: 'selectable', // to be removed

  // v1
  REVIEW: 'review', // to be replaced with shortlisting
  SHORTLISTED: 'shortlisted', // to be replaced with selection
  SELECTED: 'selected', // to be replaced with recommendation
  RECOMMENDED: 'recommended', // to be replaced with recommendation
  HANDOVER: 'handover', // to be removed/replaced with recommendation
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
  FULL_APPLICATION_NOT_SUBMITTED: 'fullApplicationNotSubmitted',
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
  REJECTED_MERIT: 'rejectedMerit',
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
  SECOND_STAGE_PASSED: 'empTiebreakerPassed',
  SECOND_STAGE_FAILED: 'empTiebreakerFailed',
  APPROVED_IMMEDIATE: 'approvedImmediate',
  APPROVED_FUTURE: 'approvedFuture',
  WITHDRAWN: 'withdrawn',

  // shortlisting other
  OTHER_PASSED: 'otherPassed',
  OTHER_FAILED: 'otherFailed',

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

const LANGUAGES = {
  ENGLISH: 'eng',
  WELSH: 'cym',
};

const TASK_TYPE = {
  SIFT: 'sift',
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
  PRE_SELECTION_DAY_QUESTIONNAIRE: 'preSelectionDayQuestionnaire',
  SELECTION_DAY: 'selectionDay',
  SELECTION_OUTCOME: 'selectionOutcome',
  EMP_TIEBREAKER: 'empTiebreaker',
};

const SHORTLISTING_TASK_TYPES = [
  TASK_TYPE.TELEPHONE_ASSESSMENT,
  TASK_TYPE.SIFT,
  TASK_TYPE.CRITICAL_ANALYSIS,
  TASK_TYPE.SITUATIONAL_JUDGEMENT,
  TASK_TYPE.QUALIFYING_TEST,
  TASK_TYPE.SCENARIO,
];

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
  SINGLE_MOTORING_OFFENCE: 'singleMotoringOffence',
  MULTIPLE_MOTORING_OFFENCES: 'multipleMotoringOffences',
  SINGLE_PENALTY_NOTICE: 'singlePenaltyNotice',
  MULTIPLE_PENALTY_NOTICES: 'multiplePenaltyNotices',
  SINGLE_CRIMINAL_OFFENCE: 'singleCriminalOffence',
  MULTIPLE_CRIMINAL_OFFENCES: 'multipleCriminalOffences',
  SINGLE_FINANCIAL_OFFENCE: 'singleFinancialOffence',
  MULTIPLE_FINANCIAL_OFFENCES: 'multipleFinancialOffences',
  SINGLE_PROFESSIONAL_CONDUCT: 'singleProfessionalConduct',
  MULTIPLE_PROFESSIONAL_CONDUCTS: 'multipleProfessionalConducts',
  SINGLE_OTHER_MATTER: 'singleOtherMatter',
  MULTIPLE_OTHER_MATTERS: 'multipleOtherMatters',
  MIXED: 'mixed',
};

const GUIDANCE_REFERENCE = {
  CRIMINAL_OFFENCES: 'criminalOffences',
  MOTERING_OFFENCES: 'moteringOffences',
  FIXED_PENALTY_NOTICES: 'fixedPenaltyNotices',
  FINANCIAL_INSOLVENCY_DEBT: 'financialInsolvencyDebt',
  FINANCIAL_VAT_TAX: 'financialVatTax',
  PROFESSIONAL_CONDUCT: 'professionalConduct',
  FURTHER_DISCLOSURES: 'furtherDisclosures',
};
// for exercises launched after 15/10/2024
const GUIDANCE_REFERENCE_V2 = {
  CRIMINAL_OFFENCES: 'criminalOffencesV2',
  MOTERING_OFFENCES: 'moteringOffencesV2',
  FIXED_PENALTY_NOTICES: 'fixedPenaltyNoticesV2',
  FINANCIAL_INSOLVENCY_DEBT: 'financialInsolvencyDebtV2',
  FINANCIAL_VAT_TAX: 'financialVatTaxV2',
  PROFESSIONAL_CONDUCT: 'professionalConductV2',
  CIVIL_PROCEEDINGS: 'civilProceedingsV2',
  FURTHER_DISCLOSURES: 'furtherDisclosuresV2',
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

const APPLICATION_FORM_PARTS = {
  PERSONAL_DETAILS: 'personalDetails',
  CHARACTER_INFORMATION: 'characterInformation',
  EQUALITY_AND_DIVERSITY_SURVEY: 'equalityAndDiversitySurvey',
  PART_TIME_WORKING_PREFERENCES: 'partTimeWorkingPreferences',
  LOCATION_PREFERENCES: 'locationPreferences',
  JURISDICTION_PREFERENCES: 'jurisdictionPreferences',
  ADDITIONAL_WORKING_PREFERENCES: 'additionalWorkingPreferences',
  WELSH_POSTS: 'welshPosts',
  RELEVANT_QUALIFICATIONS: 'relevantQualifications',
  RELEVANT_MEMBERSHIPS: 'relevantMemberships',
  POST_QUALIFICATION_WORK_EXPERIENCE: 'postQualificationWorkExperience',
  JUDICIAL_EXPERIENCE: 'judicialExperience',
  RELEVANT_EXPERIENCE: 'relevantExperience',
  EMPLOYMENT_GAPS: 'employmentGaps',
  REASONABLE_LENGTH_OF_SERVICE: 'reasonableLengthOfService',
  ASSESSORS_DETAILS: 'assessorsDetails',
  LEADERSHIP_JUDGE_DETAILS: 'leadershipJudgeDetails',
  STATEMENT_OF_SUITABILITY: 'statementOfSuitability',
  COVERING_LETTER: 'coveringLetter',
  CV: 'cv',
  STATEMENT_OF_ELIGIBILITY: 'statementOfEligibility',
  SELF_ASSESSMENT_COMPETENCIES: 'selfAssessmentCompetencies',
  ADDITIONAL_INFO: 'additionalInfo',
  CANDIDATE_AVAILABILITY: 'candidateAvailability',
  PANEL_CONFLICTS: 'panelConflicts',
  COMMISSIONER_CONFLICTS: 'commissionerConflicts',
  CHARACTER_CHECKS: 'characterChecks',
  REASONABLE_ADJUSTMENTS: 'reasonableAdjustments',
  WORKING_PREFERENCES: 'workingPreferences',
};

const DEFAULT_WORD_COUNT = {
  ADDITIONAL_SELECTION_CRITERIA: 250,
};

const SELF_ASSESSMENT_COMPETENCIES_QUESTIONS = [
  'Exercising Judgement',
  'Possessing and Building Knowledge',
  'Assimilating and Clarifying Information',
  'Working and Communicating with Others',
  'Managing Work Efficiently',
  'Leadership',
  'Legal and judicial skills',
  'Personal qualities',
  'Working Effectively',
  'Career Highlights',
];

const WORKING_BASIS = {
  FULL_TIME: 'full-time',
  SALARIED_PART_TIME: 'salaried-part-time',
  FEE_PAID: 'fee-paid',
  VOLUNTARY: 'voluntary',
};

export {
  STATUS,
  EXERCISE_STAGE,
  APPLICATION_STATUS,
  TASK_TYPE,
  SHORTLISTING_TASK_TYPES,
  TASK_QT_MAP,
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  ADVERT_TYPES,
  DEFAULT,
  INDEPENDENT_ASSESSMENTS_STATUS,
  ASSESSOR_TYPES,
  OFFENCE_CATEGORY,
  GUIDANCE_REFERENCE,
  GUIDANCE_REFERENCE_V2,
  ASSESSMENT_METHOD,
  APPLICATION_FORM_PARTS,
  DEFAULT_WORD_COUNT,
  SELF_ASSESSMENT_COMPETENCIES_QUESTIONS,
  WORKING_BASIS,
  LANGUAGES
};

// end
