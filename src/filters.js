import * as filters from '@jac-uk/jac-kit/filters/filters';
import { ADVERT_TYPES, EXERCISE_STAGE, APPLICATION_STATUS, TASK_TYPE, OFFENCE_CATEGORY, INDEPENDENT_ASSESSMENTS_STATUS, ASSESSOR_TYPES, ASSESSMENT_METHOD, APPLICATION_FORM_PARTS, WORKING_BASIS } from '@/helpers/constants';

const lookup = (value) => {
  let returnValue;
  const lookup = {
    // application parts
    personalDetails: 'Personal details',
    street: 'Street',
    street2: 'Street 2',
    town: 'Town or city',
    county: 'County',
    postcode: 'Postcode',
    VATNumber: 'VAT number',
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
    commissionerConflicts: 'Commissioner conflicts',

    // exercise states
    draft: 'Draft',
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
    gender: 'Gender',
    ethnicity: 'Ethnicity',
    professionalBackground: 'Professional Background',
    emp: 'EMP',
    socialMobility: 'Social Mobility',
    disability: 'Disability',
    empNoAnswer: 'Not applied',

    // Diversity report
    preferNotToSay: 'Prefer not to say',
    noAnswer: 'No answer',
    genderNeutral: 'Gender neutral',
    firstGenerationUniversity: 'First Generation At University',
    parentsAttendedUniversity: 'Parents Attended University',
    parentsNotAttendedUniversity: 'Parents Did Not Attend University',
    attendedUKStateSchool: 'Attended UK state school',
    white: 'White',
    bame: 'Ethnic minorities',
    male: 'Male',
    female: 'Female',
    applied: 'Applied',
    no: 'No',
    yes: 'Yes',

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

    // Set pass/fail
    'pass': 'Pass',
    'fail': 'Fail',

    'other': 'Other',

    archived: 'Archived',

    // Outreach report headers
    'NINumber': 'National Insurance Number',
    'name': 'Name',
    // gender
    // ethnicity
    exerciseReferenceNumber: 'Exercise',
    exerciseName: 'Exercise Name',
    stage: 'Stage',
    status: 'Status',
    id: 'exercise id',

    // outreach report values
    approvedForImmediateAppointment: 'Approved For Immediate Appointment',
    passedSelection: 'Passed Selection',

    // Additional Information
    twitter: 'Twitter',
    'jac-website': 'JAC Website',
    'professional-body-website-or-email': 'Professional body website or email (eg The Law Society)',
    'professional-body-magazine': 'Professional body magazine',
    'judicial-office-extranet': 'Judicial Office Extranet',
    'judging-your-future-newsletter': 'Judging Your Future Newsletter',
    'linked-in': 'LinkedIn',
    'word-of-mouth': 'Word of mouth',

    // reasonable adjustments status
    approved: 'Approved',
    denied: 'Denied',

    // Score Types
    score: 'Score',
    percent: 'Percent',
    zScore: 'Z Score',
    grade: 'Grade',

    // reasonable adjustments reason
    'qualifying-test': 'Qualifying Test',
    'scenario-test': 'Scenario Test',
    'selection-day': 'Selection Day',

    // post-qualification experience
    'judicial-post': 'Judicial',
    'quasi-judicial-post': 'Quasi-judicial',
    'locationPreference': 'Location preference',
    'jurisdictionPreference': 'Jurisdiction preference',

    // 'xxx': 'xxx',
    null: '[No Answer Provided]',
  };

  lookup[ADVERT_TYPES.LISTING] = 'Listing';
  lookup[ADVERT_TYPES.BASIC] = 'Basic';
  lookup[ADVERT_TYPES.FULL] = 'Full';
  lookup[ADVERT_TYPES.EXTERNAL] = 'External';

  lookup[EXERCISE_STAGE.REVIEW] = 'Review';
  lookup[EXERCISE_STAGE.APPLIED] = 'Applied';
  lookup[EXERCISE_STAGE.SHORTLISTED] = 'Shortlisted';
  lookup[EXERCISE_STAGE.SELECTABLE] = 'Selectable';
  lookup[EXERCISE_STAGE.RECOMMENDED] = 'Recommended to SCC';
  lookup[EXERCISE_STAGE.HANDOVER] = 'Handover to JO';

  lookup[APPLICATION_STATUS.PASSED_NOT_RECOMMENDED] = 'Passed but not recommended to SCC';
  lookup[APPLICATION_STATUS.PASSED_RECOMMENDED] = 'Passed and recommended to SCC';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_FAILED] = 'Failed qualifying test';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_PASSED] = 'Passed qualifying test';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_NOT_SUBMITTED] = 'No test submitted (first test)';
  lookup[APPLICATION_STATUS.RECOMMENDED_FUTURE] = 'Recommended for future appointment';
  lookup[APPLICATION_STATUS.RECOMMENDED_IMMEDIATE] = 'Recommended for immediate appointment';
  lookup[APPLICATION_STATUS.RECONSIDER] = 'SCC to reconsider';
  lookup[APPLICATION_STATUS.REJECTED_CHARACTER] = 'Rejected on character';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL] = 'Rejected as ineligible (ASC)';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY] = 'Rejected as ineligible (statutory requirements)';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_FAILED] = 'Failed scenario test';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_PASSED] = 'Passed scenario test';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_NOT_SUBMITTED] = 'No test submitted (scenario test)';
  lookup[APPLICATION_STATUS.SECOND_STAGE_INVITED] = 'Invited to EMP Tie-breaker';
  lookup[APPLICATION_STATUS.SELECTION_FAILED] = 'Failed selection day';
  lookup[APPLICATION_STATUS.SELECTION_INVITED] = 'Invited to selection day';
  lookup[APPLICATION_STATUS.SELECTION_OUTCOME_PASSED] = 'Passed selection';
  lookup[APPLICATION_STATUS.SELECTION_OUTCOME_FAILED] = 'Failed selection';
  lookup[APPLICATION_STATUS.SIFT_FAILED] = 'Failed sift';
  lookup[APPLICATION_STATUS.SIFT_PASSED] = 'Passed sift';
  lookup[APPLICATION_STATUS.WITHDRAWN] = 'Withdrawn';

  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}`] = 'Critical Analysis Test';
  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}Passed`] = 'Passed CA';
  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}Failed`] = 'Failed CA';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}`] = 'Situational Judgement Test';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}Passed`] = 'Passed SJ';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}Failed`] = 'Failed SJ';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}`] = 'QT Merit List';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}Passed`] = 'Passed first test';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}Failed`] = 'Failed first test';
  lookup[`${TASK_TYPE.SCENARIO}`] = 'Scenario Test';
  lookup[`${TASK_TYPE.SCENARIO}Passed`] = 'Passed scenario test';
  lookup[`${TASK_TYPE.SCENARIO}Failed`] = 'Failed scenario test';
  lookup[TASK_TYPE.TELEPHONE_ASSESSMENT] = 'Telephone Assessment';
  lookup[`${TASK_TYPE.TELEPHONE_ASSESSMENT}Passed`] = 'Passed telephone assessment';
  lookup[`${TASK_TYPE.TELEPHONE_ASSESSMENT}Failed`] = 'Failed telephone assessment';
  lookup[TASK_TYPE.ELIGIBILITY_SCC] = 'Eligibility SCC';
  lookup[`${TASK_TYPE.ELIGIBILITY_SCC}Passed`] = 'Passed eligibility SCC';
  lookup[`${TASK_TYPE.ELIGIBILITY_SCC}Failed`] = 'Failed eligibility SCC';
  lookup[TASK_TYPE.CHARACTER_AND_SELECTION_SCC] = 'Character and Selection SCC';
  lookup[`${TASK_TYPE.CHARACTER_AND_SELECTION_SCC}Passed`] = 'Passed character and selection SCC';
  lookup[`${TASK_TYPE.CHARACTER_AND_SELECTION_SCC}Failed`] = 'Failed character and selection SCC';
  lookup[TASK_TYPE.STATUTORY_CONSULTATION] = 'Statutory Consultation';
  lookup[`${TASK_TYPE.STATUTORY_CONSULTATION}Passed`] = 'Passed statutory consultation';
  lookup[`${TASK_TYPE.STATUTORY_CONSULTATION}Failed`] = 'Failed statutory consultation';
  lookup[TASK_TYPE.SHORTLISTING_OUTCOME] = 'Shortlisting Outcome';
  lookup[`${TASK_TYPE.SHORTLISTING_OUTCOME}Passed`] = 'Passed shortlisting';
  lookup[`${TASK_TYPE.SHORTLISTING_OUTCOME}Failed`] = 'Failed shortlisting';
  lookup[TASK_TYPE.WELSH_ASSESSMENT] = 'Welsh Assessment';
  lookup[TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE] = 'Pre Selection Day Questionnaire';
  lookup[`${TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE}Passed`] = 'Completed PSDQ';
  lookup[`${TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE}Failed`] = 'Not completed PSDQ';
  lookup[TASK_TYPE.SELECTION_DAY] = 'Selection Day';
  lookup[`${TASK_TYPE.SELECTION_DAY}Passed`] = 'Passed selection day';
  lookup[`${TASK_TYPE.SELECTION_DAY}Failed`] = 'Failed selection day';
  lookup[TASK_TYPE.SELECTION_OUTCOME] = 'Selection Outcome';
  lookup[TASK_TYPE.EMP_TIEBREAKER] = 'EMP Tie-breaker';
  lookup[`${TASK_TYPE.EMP_TIEBREAKER}Passed`] = 'Passed EMP Tie-breaker';
  lookup[`${TASK_TYPE.EMP_TIEBREAKER}Failed`] = 'Failed EMP Tie-breaker';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DRAFT] = 'Draft';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.PENDING] = 'Pending';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.COMPLETED] = 'Completed';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.CANCELLED] = 'Cancelled';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DECLINED] = 'Declined';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DELETED] = 'Deleted';

  lookup[ASSESSOR_TYPES.PROFESSIONAL] = 'Professional assessor';
  lookup[ASSESSOR_TYPES.JUDICIAL] = 'Judicial assessor';
  lookup[ASSESSOR_TYPES.PERSONAL] = 'Personal assessor';

  // character issues offence category
  lookup[OFFENCE_CATEGORY.SINGLE_CRIMINAL_OFFENCE] = 'Single criminal offence';
  lookup[OFFENCE_CATEGORY.MULTIPLE_CRIMINAL_OFFENCES] = 'Multiple criminal offences';
  lookup[OFFENCE_CATEGORY.SINGLE_MOTORING_OFFENCE] = 'Single motoring offence';
  lookup[OFFENCE_CATEGORY.MULTIPLE_MOTORING_OFFENCES] = 'Multiple motoring offences';
  lookup[OFFENCE_CATEGORY.SINGLE_FINANCIAL_OFFENCE] = 'Single financial offence';
  lookup[OFFENCE_CATEGORY.MULTIPLE_FINANCIAL_OFFENCES] = 'Multiple financial offences';
  lookup[OFFENCE_CATEGORY.SINGLE_PROFESSIONAL_CONDUCT] = 'Single professional conduct';
  lookup[OFFENCE_CATEGORY.MULTIPLE_PROFESSIONAL_CONDUCTS] = 'Multiple professional conducts';
  lookup[OFFENCE_CATEGORY.SINGLE_OTHER_MATTER] = 'Single other matter';
  lookup[OFFENCE_CATEGORY.MULTIPLE_OTHER_MATTERS] = 'Multiple other matters';
  lookup[OFFENCE_CATEGORY.MIXED] = 'Mixed';

  // assessment methods
  lookup[ASSESSMENT_METHOD.SELF_ASSESSMENT_WITH_COMPETENCIES] = 'Self Assessment with competencies';
  lookup[ASSESSMENT_METHOD.COVERING_LETTER] = 'Covering letter';
  lookup[ASSESSMENT_METHOD.CV] = 'CV';
  lookup[ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_COMPETENCIES] = 'Statement of Suitability with competencies';
  lookup[ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_SKILLS_AND_ABILITIES] = 'Statement of Suitability with skills and abilities';
  lookup[ASSESSMENT_METHOD.STATEMENT_OF_ELIGIBILITY] = 'Statement of eligibility';
  lookup[ASSESSMENT_METHOD.INDEPENDENT_ASSESSMENTS] = 'Independent Assessments';
  lookup[ASSESSMENT_METHOD.LEADERSHIP_JUDGE_ASSESSMENT] = 'Leadership Judge Assessment';

  // form parts
  lookup[APPLICATION_FORM_PARTS.CANDIDATE_AVAILABILITY] = 'Candidate Availability';
  lookup[APPLICATION_FORM_PARTS.PANEL_CONFLICTS] = 'Panel Conflicts';
  lookup[APPLICATION_FORM_PARTS.COMMISSIONER_CONFLICTS] = 'Commissioner Conflicts';
  lookup[APPLICATION_FORM_PARTS.CHARACTER_CHECKS] = 'Character Checks';
  lookup[APPLICATION_FORM_PARTS.REASONABLE_ADJUSTMENTS] = 'Reasonable Adjustments';
  lookup[APPLICATION_FORM_PARTS.WORKING_PREFERENCES] = 'Working Preferences';

  // working basis
  lookup[WORKING_BASIS.FULL_TIME] = 'Full-time';
  lookup[WORKING_BASIS.SALARIED_PART_TIME] = 'Salaried part-time';
  lookup[WORKING_BASIS.FEE_PAID] = 'Fee paid';
  lookup[WORKING_BASIS.VOLUNTARY] = 'Voluntary';

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

const pluralise = (word, quantity) => {
  if (quantity === 1) {
    return word;
  } else {
    // TODO could hardcode words from our vocabulary which don't fit the default pattern of singular->WORD, plural->WORDs. If there are any?!
    return `${word}s`;
  }
};

export {
  lookup,
  pluralise
};

