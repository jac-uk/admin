import * as filters from '@jac-uk/jac-kit/filters/filters';
import { ADVERT_TYPES, EXERCISE_STAGE, APPLICATION_STATUS } from '@/helpers/constants';

const lookup = (value) => {
  let returnValue;
  const lookup = {
    // application parts
    personalDetails: 'Personal details',
    characterInformation: 'Character information',
    equalityAndDiversitySurvey: 'Equality and diversity',
    partTimeWorkingPreferences: 'Set part-time working preferences',
    locationPreferences: 'Location preferences',
    jurisdictionPreferences: 'Jurisdiction preferences',
    additionalWorkingPreferences: 'Additional preferences',
    welshPosts: 'Welsh posts',
    relevantQualifications: 'Relevant qualifications',
    postQualificationWorkExperience: 'Post-qualification work experience',
    judicialExperience: 'Judicial experience',
    relevantMemberships: 'Relevant memberships',
    relevantExperience: 'Relevant experience',
    employmentGaps: 'Gaps in employment',
    reasonableLengthOfService: 'Reasonable length of service',
    assessorsDetails: 'Independent assessors\' details',
    leadershipJudgeDetails: 'Leadership Judge details',
    statementOfSuitability: 'Statement of suitability',
    cv: 'Curriculum vitae (CV)',
    coveringLetter: 'Covering letter',
    statementOfEligibility: 'Statement of eligibility',
    selfAssessmentCompetencies: 'Self assessment with competencies',
    additionalInfo: 'Additional Information',

    // exercise states
    registration: 'Registration',
    shortlisting: 'Shortlisting',
    selection: 'Selection',
    recommendation: 'Recommendation',
    handover: 'Handover',

    // application process steps
    passedTests: 'Passed Tests',
    shortlisted: 'Shortlisted',
    selected: 'Selected',
    recommended: 'Recommended',
    passedCA: 'Passed CA',
    failedCA: 'Failed CA',
    passedSJ: 'Passed SJ',
    failedSJ: 'Failed SJ',
    passedScenario: 'Passed Scenario Test',
    failedScenario: 'Failed Scenario Test',

    // Editable Application helpers
    date: 'Date',
    details: 'Details',
    investigations: 'Investigations',
    orgBusinessName: 'Organisation or business',
    jobTitle: 'Job Title',
    tasks: 'Law-related tasks',
    startDate: 'Start Date',
    endDate: 'End Date',

    // emp flags
    'gender': 'Gender',
    'ethnicity': 'Ethnicity',

    // PAJE answers
    'online-and-judge-led': 'Yes - online resources and judge-led discussion group course',
    'online-only': 'Yes - online resources only',

    // Panel types
    'sift': 'Sift',
    'scenario': 'Scenario',

    // Panel roles
    'chair': 'Chair',
    'independent': 'Independent',
    'judicial': 'Judicial',

    // Selection categories
    'leadership': 'Strategic Leadership Questions',
    'roleplay': 'Role Play',
    'situational': 'Situational Questions',
    'interview': 'Interview',
    'overall': 'Overall',

    // Capabilities
    'L': 'Leadership',
    'EJ': 'Exercising Judgement',
    'PBK': 'Possessing and Building Knowledge',
    'ACI': 'Assimilating and Clarifying Information',
    'WCO': 'Working and Communicating with Others',
    'MWE': 'Managing Work Efficiently',
    'OVERALL': 'Overall',
    'L&J': 'Legal & Judicial Skills',
    'PQ': 'Personal Qualities',

    'critical-analysisPassed': 'Passed CA',
    'critical-analysisFailed': 'Failed CA',

    // 'xxx': 'xxx',
  };

  lookup[ADVERT_TYPES.LISTING] = 'Listing';
  lookup[ADVERT_TYPES.BASIC] = 'Basic';
  lookup[ADVERT_TYPES.FULL] = 'Full';
  lookup[ADVERT_TYPES.EXTERNAL] = 'External';

  lookup[EXERCISE_STAGE.APPLIED] = 'Applied';
  lookup[EXERCISE_STAGE.SHORTLISTED] = 'Shortlisted';
  lookup[EXERCISE_STAGE.SELECTABLE] = 'Selectable';
  lookup[EXERCISE_STAGE.RECOMMENDED] = 'Recommended';
  lookup[EXERCISE_STAGE.HANDOVER] = 'Handover';

  lookup[APPLICATION_STATUS.PASSED_NOT_RECOMMENDED] = 'Passed but not recommended to SCC';
  lookup[APPLICATION_STATUS.PASSED_RECOMMENDED] = 'Passed and recommended to SCC';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_FAILED] = 'Failed qualifying test';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_PASSED] = 'Passed qualifying test';
  lookup[APPLICATION_STATUS.RECOMMENDED_FUTURE] = 'Recommended for future appointment';
  lookup[APPLICATION_STATUS.RECOMMENDED_IMMEDIATE] = 'Recommended for immediate appointment';
  lookup[APPLICATION_STATUS.RECONSIDER] = 'SCC to reconsider';
  lookup[APPLICATION_STATUS.REJECTED_CHARACTER] = 'Rejected on character';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL] = 'Rejected as ineligible (ASC)';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY] = 'Rejected as ineligible (statutory requirements)';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_FAILED] = 'Failed scenario test';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_PASSED] = 'Passed scenario test';
  lookup[APPLICATION_STATUS.SECOND_STAGE_INVITED] = 'Invited to EMP second stage assessment';
  lookup[APPLICATION_STATUS.SELECTION_FAILED] = 'Failed selection';
  lookup[APPLICATION_STATUS.SELECTION_INVITED] = 'Invited to selection';
  lookup[APPLICATION_STATUS.SELECTION_PASSED] = 'Passed selection';
  lookup[APPLICATION_STATUS.SIFT_FAILED] = 'Failed sift';
  lookup[APPLICATION_STATUS.SIFT_PASSED] = 'Passed sift';
  lookup[APPLICATION_STATUS.WITHDRAWN] = 'Withdrawn';

  returnValue = lookup[value];

  if (!returnValue) {
    if (Object.keys(filters).indexOf('lookup') >= 0) { // use jac-kit lookup, if it exists
      returnValue = filters.lookup(value);
    }
  }
  if (!returnValue) {
    returnValue = value;
  }
  return returnValue;
};

export {
  lookup
};
