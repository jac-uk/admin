import * as filters from '@jac-uk/jac-kit/filters/filters';
import { ADVERT_TYPES, INDEPENDENT_ASSESSMENTS_STATUS, ASSESSOR_TYPES } from '@/helpers/constants';

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

    // 'xxx': 'xxx',
  };

  lookup[ADVERT_TYPES.LISTING] = 'Listing';
  lookup[ADVERT_TYPES.BASIC] = 'Basic';
  lookup[ADVERT_TYPES.FULL] = 'Full';
  lookup[ADVERT_TYPES.EXTERNAL] = 'External';

  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DRAFT] = 'Draft';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.PENDING] = 'Pending';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.COMPLETED] = 'Completed';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.CANCELLED] = 'Cancelled';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DECLINED] = 'Declined';
  lookup[INDEPENDENT_ASSESSMENTS_STATUS.DELETED] = 'Deleted';

  lookup[ASSESSOR_TYPES.PROFESSIONAL] = 'Professional assessor';
  lookup[ASSESSOR_TYPES.JUDICIAL] = 'Judicial assessor';
  lookup[ASSESSOR_TYPES.PERSONAL] = 'Personal assessor';

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
