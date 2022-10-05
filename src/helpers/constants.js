import {
  STATUS,
  EXERCISE_STAGE,
  APPLICATION_STATUS,
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
  SHORTLISTING,
  QUALIFYING_TEST,
  QUALIFYING_TEST_RESPONSE,
  ADVERT_TYPES,
  DEFAULT,
  OFFENCE_CATEGORY
};
