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
    HANDOVER: 'handover',
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
    PASSED_SELECTION: 'passedSelection',
    FAILED_SELECTION: 'failedSelection',
    PASSED_BUT_NOT_RECOMMENDED: 'passedButNotRecommended',
// ###  RECOMMENDED
    REJECTED_BY_CHARACTER: 'rejectedByCharacter',
    // REJECTED_AS_INELIGIBLE: '',
    APPROVED_FOR_IMMEDIATE_APPOINTMENT: 'approvedForImmediateAppointment',
    APPROVED_FOR_FUTURE_APPOINTMENT: 'approvedForFutureAppointment',
    SCC_TO_RECONSIDER: 'sccToReconsider',
};

export { STATUS, EXERCISE_STAGE, APPLICATION_STATUS };
