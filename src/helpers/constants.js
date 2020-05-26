const STATUS = {
    DRAFT: 'draft',
    APPLIED: 'applied',
    WITHDRAWN: 'withdrawn',
    SELECTED: 'selected',
};

const EXERCISE_STAGE = {
	REVIEW: 'review',
	SHORTLISTED: 'shortlisted',
	SELECTED: 'selected',
	RECOMMENDED: 'recommended',
};

const APPLICATION_STATUS = {
// ###  REVIEW
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
// ###  SHORTLISTED
    INVITED_TO_SELECTION_DAY: '',
    // REJECTED_AS_INELIGIBLE: '',
    // WITHDREW_APPLICATION: '',
// ###  SELECTED
    PASSED_SELECTION: '',
    FAILED_SELECTION: '',
    PASSED_BUT_NOT_RECOMMENDED: '',
// ###  RECOMMENDED
    REJECTED_BY_CHARACTER: '',
    // REJECTED_AS_INELIGIBLE: '',
    APPROVED_FOR_IMMEDIATE_APPOINTMENT: '',
    APPROVED_FOR_FUTURE_APPOINTMENT: '',
    SCC_TO_RECONSIDER: '',
};

export { STATUS, EXERCISE_STAGE, APPLICATION_STATUS };
