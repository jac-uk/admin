import * as filters from '@jac-uk/jac-kit/filters/filters';
import { ADVERT_TYPES, EXERCISE_STAGE, APPLICATION_STATUS, TASK_TYPE, OFFENCE_CATEGORY, GUIDANCE_REFERENCE, INDEPENDENT_ASSESSMENTS_STATUS, ASSESSOR_TYPES, ASSESSMENT_METHOD, APPLICATION_FORM_PARTS, WORKING_BASIS } from '@/helpers/constants';

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

    'locationPreference': 'Location preference',
    'jurisdictionPreference': 'Jurisdiction preference',
    // post-qualification experience
    'judicial-post': 'Judicial',
    'quasi-judicial-post': 'Quasi-judicial',

    // eligibility issues
    pq: 'Professional Qualification',
    pje: 'Previous Judicial Experience',
    pr: 'Professional Registration',

    // 'xxx': 'xxx',
    null: '[No Answer Provided]',
  };

  lookup[ADVERT_TYPES.LISTING] = 'Listing';
  lookup[ADVERT_TYPES.BASIC] = 'Basic';
  lookup[ADVERT_TYPES.FULL] = 'Full';
  lookup[ADVERT_TYPES.EXTERNAL] = 'External';

  // v2 exercise stages
  lookup[EXERCISE_STAGE.SHORTLISTING] = 'Shortlisting';
  lookup[EXERCISE_STAGE.SELECTION] = 'Selection Days';
  lookup[EXERCISE_STAGE.SCC] = 'SCC';
  lookup[EXERCISE_STAGE.RECOMMENDATION] = 'Recommendations';

  lookup[EXERCISE_STAGE.REVIEW] = 'Review';
  lookup[EXERCISE_STAGE.APPLIED] = 'Applied';
  lookup[EXERCISE_STAGE.SHORTLISTED] = 'Shortlisted';
  lookup[EXERCISE_STAGE.SELECTABLE] = 'Selectable';
  lookup[EXERCISE_STAGE.RECOMMENDED] = 'Recommended to SCC';
  lookup[EXERCISE_STAGE.HANDOVER] = 'Handover to JO';

  lookup[APPLICATION_STATUS.PASSED_NOT_RECOMMENDED] = 'Passed but not recommended to SCC';
  lookup[APPLICATION_STATUS.PASSED_RECOMMENDED] = 'Recommended to SCC';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_FAILED] = 'Failed qualifying test';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_PASSED] = 'Passed qualifying test';
  lookup[APPLICATION_STATUS.QUALIFYING_TEST_NOT_SUBMITTED] = 'Qualifying Test Not Started';
  lookup[APPLICATION_STATUS.FULL_APPLICATION_NOT_SUBMITTED] = 'Full application not submitted';
  lookup[APPLICATION_STATUS.RECOMMENDED_FUTURE] = 'Recommended Future';
  lookup[APPLICATION_STATUS.RECOMMENDED_IMMEDIATE] = 'Recommended Immediate';
  lookup[APPLICATION_STATUS.APPROVED_FUTURE] = 'Approved Future';
  lookup[APPLICATION_STATUS.APPROVED_IMMEDIATE] = 'Approved Immediate';
  lookup[APPLICATION_STATUS.RECONSIDER] = 'Reconsider';
  lookup[APPLICATION_STATUS.REJECTED_CHARACTER] = 'Character - Rejected';
  lookup[APPLICATION_STATUS.REJECTED_MERIT] = 'Merit - Rejected';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL] = 'Ineligible (ASC) - Rejected';
  lookup[APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY] = 'Ineligible (Statutory) - Rejected';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_FAILED] = 'Failed scenario test';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_PASSED] = 'Passed scenario test';
  lookup[APPLICATION_STATUS.SCENARIO_TEST_NOT_SUBMITTED] = 'Scenario Test Not Started';
  lookup[APPLICATION_STATUS.SECOND_STAGE_INVITED] = 'EMP Tiebreaker Invited';
  lookup[APPLICATION_STATUS.SELECTION_FAILED] = 'Failed selection day';
  lookup[APPLICATION_STATUS.SELECTION_INVITED] = 'Invited to selection day';
  lookup[APPLICATION_STATUS.SELECTION_OUTCOME_PASSED] = 'Passed selection';
  lookup[APPLICATION_STATUS.SELECTION_OUTCOME_FAILED] = 'Failed selection';
  lookup[APPLICATION_STATUS.SIFT_FAILED] = 'Sift Failed';
  lookup[APPLICATION_STATUS.SIFT_PASSED] = 'Sift Passed';
  lookup[APPLICATION_STATUS.WITHDRAWN] = 'Withdrew';

  lookup[APPLICATION_STATUS.OTHER_PASSED] = 'Other Passed';
  lookup[APPLICATION_STATUS.OTHER_FAILED] = 'Other Failed';

  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}`] = 'Critical Analysis Test';
  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}Passed`] = 'Critical Analysis Test Passed';
  lookup[`${TASK_TYPE.CRITICAL_ANALYSIS}Failed`] = 'Critical Analysis Test Failed';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}`] = 'Situational Judgement Test';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}Passed`] = 'Situational Judgement Test Passed';
  lookup[`${TASK_TYPE.SITUATIONAL_JUDGEMENT}Failed`] = 'Situational Judgement Test Failed';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}`] = 'QT Merit List';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}Passed`] = 'Qualifying Test(s) Passed';
  lookup[`${TASK_TYPE.QUALIFYING_TEST}Failed`] = 'Qualifying Test(s) Failed';
  lookup[`${TASK_TYPE.SCENARIO}`] = 'Scenario Test';
  lookup[`${TASK_TYPE.SCENARIO}Passed`] = 'Scenario Test Passed';
  lookup[`${TASK_TYPE.SCENARIO}Failed`] = 'Scenario Test Failed';
  lookup[TASK_TYPE.TELEPHONE_ASSESSMENT] = 'Telephone Assessment';
  lookup[`${TASK_TYPE.TELEPHONE_ASSESSMENT}Passed`] = 'Telephone Assessment Passed';
  lookup[`${TASK_TYPE.TELEPHONE_ASSESSMENT}Failed`] = 'Telephone Assessment Failed';
  lookup[TASK_TYPE.ELIGIBILITY_SCC] = 'Eligibility SCC';
  lookup[TASK_TYPE.CHARACTER_AND_SELECTION_SCC] = 'Character and Selection SCC';
  lookup[TASK_TYPE.STATUTORY_CONSULTATION] = 'Statutory Consultation';
  lookup[TASK_TYPE.SHORTLISTING_OUTCOME] = 'Shortlisting Outcome';
  lookup[`${TASK_TYPE.SHORTLISTING_OUTCOME}Passed`] = 'Shortlisting Passed';
  lookup[`${TASK_TYPE.SHORTLISTING_OUTCOME}Failed`] = 'Shortlisting Failed';
  // lookup[TASK_TYPE.WELSH_ASSESSMENT] = 'Welsh Assessment';
  lookup[TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE] = 'Pre Selection Day Questionnaire';
  lookup[TASK_TYPE.SELECTION_DAY] = 'Selection Day';
  lookup[`${TASK_TYPE.SELECTION_DAY}Passed`] = 'Selection Day Passed';
  lookup[`${TASK_TYPE.SELECTION_DAY}Failed`] = 'Selection Day Failed';
  lookup[TASK_TYPE.SELECTION_OUTCOME] = 'Selection Outcome';
  lookup[TASK_TYPE.EMP_TIEBREAKER] = 'EMP Tiebreaker';
  lookup[`${TASK_TYPE.EMP_TIEBREAKER}Passed`] = 'EMP Tiebreaker Passed';
  lookup[`${TASK_TYPE.EMP_TIEBREAKER}Failed`] = 'EMP Tiebreaker Failed';
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
  lookup[OFFENCE_CATEGORY.SINGLE_MOTORING_OFFENCE] = 'Single motoring offence';
  lookup[OFFENCE_CATEGORY.MULTIPLE_MOTORING_OFFENCES] = 'Multiple motoring offences';
  lookup[OFFENCE_CATEGORY.SINGLE_PENALTY_NOTICE] = 'Single Fixed Penalty Notices & Penalty Charge Notices';
  lookup[OFFENCE_CATEGORY.MULTIPLE_PENALTY_NOTICES] = 'Multiple Fixed Penalty Notices & Penalty Charge Notices';
  lookup[OFFENCE_CATEGORY.SINGLE_CRIMINAL_OFFENCE] = 'Single criminal offence';
  lookup[OFFENCE_CATEGORY.MULTIPLE_CRIMINAL_OFFENCES] = 'Multiple criminal offences';
  lookup[OFFENCE_CATEGORY.SINGLE_FINANCIAL_OFFENCE] = 'Single financial issue';
  lookup[OFFENCE_CATEGORY.MULTIPLE_FINANCIAL_OFFENCES] = 'Multiple financial issues';
  lookup[OFFENCE_CATEGORY.SINGLE_PROFESSIONAL_CONDUCT] = 'Single professional conduct matter';
  lookup[OFFENCE_CATEGORY.MULTIPLE_PROFESSIONAL_CONDUCTS] = 'Multiple professional conduct matters';
  lookup[OFFENCE_CATEGORY.SINGLE_OTHER_MATTER] = 'Single other matter';
  lookup[OFFENCE_CATEGORY.MULTIPLE_OTHER_MATTERS] = 'Multiple other matters';
  lookup[OFFENCE_CATEGORY.MIXED] = 'Mixed';

  // character issues guide reference
  lookup[GUIDANCE_REFERENCE.CRIMINAL_OFFENCES] = 'Criminal offences: paras 21-24';
  lookup[GUIDANCE_REFERENCE.MOTERING_OFFENCES] = 'Motoring offences: paras 25-30';
  lookup[GUIDANCE_REFERENCE.FIXED_PENALTY_NOTICES] = 'Fixed penalty notices: paras 31-34';
  lookup[GUIDANCE_REFERENCE.FINANCIAL_INSOLVENCY_DEBT] = 'Financial insolvency and debt: paras 35-38';
  lookup[GUIDANCE_REFERENCE.FINANCIAL_VAT_TAX] = 'Financial VAT and Tax: paras 39-43';
  lookup[GUIDANCE_REFERENCE.PROFESSIONAL_CONDUCT] = 'Professional conduct: paras 44-57';
  lookup[GUIDANCE_REFERENCE.FURTHER_DISCLOSURES] = 'Further disclosures: paras 58-65';

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

