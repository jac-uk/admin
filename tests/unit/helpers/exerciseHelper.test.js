import {
  availableStatuses,
  availableReportLinks,
  shortlistingStatuses,
  isApplicationVersionGreaterThan,
  isApplicationVersionLessThan,
  isJAC00187
} from '@/helpers/exerciseHelper';
import { EXERCISE_STAGE, SHORTLISTING, APPLICATION_STATUS } from '@/helpers/constants';

describe('availableStatuses', () => {
  it('returns statuses for shortlisting stage when processing version is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    const stage = EXERCISE_STAGE.SHORTLISTING;
    const expectedStatuses = [
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.FULL_APPLICATION_NOT_SUBMITTED,
      APPLICATION_STATUS.WITHDRAWN,
      APPLICATION_STATUS.SHORTLISTING_PASSED,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });

  it('returns statuses for selection stage when processing version is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    const stage = EXERCISE_STAGE.SELECTION;
    const expectedStatuses = [
      APPLICATION_STATUS.SELECTION_DAY_PASSED,
      APPLICATION_STATUS.SELECTION_DAY_FAILED,
      APPLICATION_STATUS.PASSED_RECOMMENDED,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });

  it('returns default statuses when stage is not recognized and processing version is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    const stage = ' invalid stage ';
    const expectedStatuses = [
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.FULL_APPLICATION_NOT_SUBMITTED,
      APPLICATION_STATUS.WITHDRAWN,
      APPLICATION_STATUS.SHORTLISTING_PASSED,
      APPLICATION_STATUS.SHORTLISTING_FAILED,
      APPLICATION_STATUS.SELECTION_DAY_PASSED,
      APPLICATION_STATUS.SELECTION_DAY_FAILED,
      APPLICATION_STATUS.PASSED_RECOMMENDED,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });

  it('returns statuses for review stage when processing version is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    const stage = EXERCISE_STAGE.REVIEW;
    const expectedStatuses = [
      APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
      APPLICATION_STATUS.WITHDREW_APPLICATION,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });

  it('returns default statuses when stage is not recognized and processing version is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    const stage = ' invalid stage ';
    const expectedStatuses = [
      APPLICATION_STATUS.INVITED_TO_SELECTION_DAY,
      APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
      APPLICATION_STATUS.PASSED_SELECTION,
      APPLICATION_STATUS.FAILED_SELECTION,
      APPLICATION_STATUS.PASSED_BUT_NOT_RECOMMENDED,
      APPLICATION_STATUS.REJECTED_BY_CHARACTER,
      APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
      APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
      APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
      APPLICATION_STATUS.SCC_TO_RECONSIDER,
      APPLICATION_STATUS.WITHDREW_APPLICATION,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });
});

describe('availableReportLinks', () => {
    it('should generate all standard report links when exercise has all standard attributes', () => {
      const exercise = {
        id: '123',
        shortlistingMethods: ['paper-sift'],
        siftStartDate: new Date(),
        scenarioTestDate: new Date(),
        selectionDays: [
          {
            selectionDayEnd: new Date(),
            selectionDayLocation: 'London',
            selectionDayStart: new Date(),
          },
        ],
        _applicationContent: {
          registration: {
            commissionerConflicts: true,
          },
        },
      };
      const path = `/exercise/${exercise.id}/reports`;
      const expectedLinks = [
        { title: 'Agency', name: 'agency' },
        { title: 'Character Annex', name: 'character-issues' },
        { title: 'Commissioner conflicts', path: `${path}/commissioner-conflicts` },
        { title: 'Custom', name: 'custom' },
        { title: 'Deployment', name: 'deployment' },
        { title: 'Diversity', name: 'exercise-reports-diversity' },
        { title: 'Eligibility Annex', name: 'eligibility-issues' },
        { title: 'Handover', name: 'handover' },
        { title: 'Merit List', name: 'merit-list' },
        { title: 'Outreach', name: 'outreach' },
        { title: 'Reasonable Adjustments', name: 'reasonable-adjustments' },
        { title: 'Scenario Responses', path: `${path}/scenario` },
        { title: 'Selection day', path: `${path}/selection` },
        { title: 'Sift', path: `${path}/sift` },
        { title: 'Statutory Consultation', name: 'statutory-consultation' },
      ];
      expect(availableReportLinks(exercise)).toEqual(expectedLinks);
    });

    it('should generate standard report links without shortlisting-specific links when exercise has no shortlisting methods', () => {
      const exercise = {
        id: '123',
        shortlistingMethods: [],
      };
      const expectedLinks = [
        { title: 'Agency', name: 'agency' },
        { title: 'Character Annex', name: 'character-issues' },
        { title: 'Custom', name: 'custom' },
        { title: 'Deployment', name: 'deployment' },
        { title: 'Diversity', name: 'exercise-reports-diversity' },
        { title: 'Eligibility Annex', name: 'eligibility-issues' },
        { title: 'Handover', name: 'handover' },
        { title: 'Merit List', name: 'merit-list' },
        { title: 'Outreach', name: 'outreach' },
        { title: 'Reasonable Adjustments', name: 'reasonable-adjustments' },
        { title: 'Statutory Consultation', name: 'statutory-consultation' },
      ];
      expect(availableReportLinks(exercise)).toEqual(expectedLinks);
    });
});

describe('shortlistingStatuses', () => {
  it('returns correct statuses when exercise._processingVersion is less than 2', () => {
    const exercise = {
      shortlistingMethods: [
        SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST,
        SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST,
        SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST,
        SHORTLISTING.NAME_BLIND_PAPER_SIFT,
        SHORTLISTING.TELEPHONE_ASSESSMENT,
        SHORTLISTING.OTHER,
      ],
      _processingVersion: 1,
    };
    const expectedStatuses = [
      APPLICATION_STATUS.SUBMITTED_FIRST_TEST,
      APPLICATION_STATUS.FAILED_FIRST_TEST,
      APPLICATION_STATUS.PASSED_FIRST_TEST,
      APPLICATION_STATUS.NO_TEST_SUBMITTED,
      APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME,
      APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST,
      APPLICATION_STATUS.FAILED_SCENARIO_TEST,
      APPLICATION_STATUS.PASSED_SCENARIO_TEST,
      APPLICATION_STATUS.PASSED_SIFT,
      APPLICATION_STATUS.FAILED_SIFT,
      APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT,
      APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT,
      APPLICATION_STATUS.OTHER_PASSED,
      APPLICATION_STATUS.OTHER_FAILED,
    ];
    expect(shortlistingStatuses(exercise)).toEqual(expectedStatuses);
  });

  it('returns correct statuses when exercise._processingVersion is greater or equal to 2', () => {
    const exercise = {
      shortlistingMethods: [
        SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST,
        SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST,
        SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST,
        SHORTLISTING.NAME_BLIND_PAPER_SIFT,
        SHORTLISTING.TELEPHONE_ASSESSMENT,
        SHORTLISTING.OTHER,
      ],
      _processingVersion: 2,
    };
    const expectedStatuses = [
      APPLICATION_STATUS.QUALIFYING_TEST_PASSED,
      APPLICATION_STATUS.QUALIFYING_TEST_FAILED,
      APPLICATION_STATUS.QUALIFYING_TEST_NOT_SUBMITTED,
      APPLICATION_STATUS.SCENARIO_TEST_PASSED,
      APPLICATION_STATUS.SCENARIO_TEST_FAILED,
      APPLICATION_STATUS.SCENARIO_TEST_NOT_SUBMITTED,
      APPLICATION_STATUS.SIFT_PASSED,
      APPLICATION_STATUS.SIFT_FAILED,
      APPLICATION_STATUS.TELEPHONE_ASSESSMENT_PASSED,
      APPLICATION_STATUS.TELEPHONE_ASSESSMENT_FAILED,
      APPLICATION_STATUS.OTHER_PASSED,
      APPLICATION_STATUS.OTHER_FAILED,
    ];
    expect(shortlistingStatuses(exercise)).toEqual(expectedStatuses);
  });

  it('returns an empty array when exercise is null or undefined', () => {
    expect(shortlistingStatuses(null)).toEqual([]);
    expect(shortlistingStatuses(undefined)).toEqual([]);
  });
});

describe('isApplicationVersionGreaterThan', () => {
  const exercise = { _applicationVersion: 2 };

  it('returns true when exercise._applicationVersion is greater than the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 1)).toBe(true);
  });

  it('returns false when exercise._applicationVersion is less than the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 3)).toBe(false);
  });

  it('returns false when exercise._applicationVersion is equal to the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 2)).toBe(false);
  });

  it('returns false when exercise object is null or undefined', () => {
    expect(isApplicationVersionGreaterThan({}, 3)).toBe(false);
    expect(isApplicationVersionGreaterThan(null, 3)).toBe(false);
    expect(isApplicationVersionGreaterThan(undefined, 3)).toBe(false);
  });
});

describe('isApplicationVersionLessThan', () => {
  const exercise = { _applicationVersion: 2 };

  it('returns true when exercise._applicationVersion is less than the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 3)).toBe(true);
  });

  it('returns false when exercise._applicationVersion is greater than the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 1)).toBe(false);
  });

  it('returns false when exercise._applicationVersion is equal to the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 2)).toBe(false);
  });

  it('returns false when exercise object is null or undefined', () => {
    expect(isApplicationVersionLessThan({}, 3)).toBe(false);
    expect(isApplicationVersionLessThan(null, 3)).toBe(false);
    expect(isApplicationVersionLessThan(undefined, 3)).toBe(false);
  });
});

describe('isJAC00187', () => {
  it('returns true when env is DEVELOP and referenceNumber is JAC00696', () => {
    expect(isJAC00187('DEVELOP', 'JAC00696')).toBe(true);
  });

  it('returns true when env is STAGING and referenceNumber is JAC00695', () => {
    expect(isJAC00187('STAGING', 'JAC00695')).toBe(true);
  });

  it('returns true when env is PRODUCTION and referenceNumber is JAC00187', () => {
    expect(isJAC00187('PRODUCTION', 'JAC00187')).toBe(true);
  });

  it('returns false when env or referenceNumber is null', () => {
    expect(isJAC00187(null, 'JAC00696')).toBe(false);
    expect(isJAC00187('DEVELOP', null)).toBe(false);
    expect(isJAC00187(null, null)).toBe(false);
  });
});

describe('isJAC00187', () => {
  it('returns true for DEVELOP environment and JAC00696 reference number', () => {
    expect(isJAC00187('DEVELOP', 'JAC00696')).toBe(true);
  });

  it('returns true for STAGING environment and JAC00695 reference number', () => {
    expect(isJAC00187('STAGING', 'JAC00695')).toBe(true);
  });

  it('returns true for PRODUCTION environment and JAC00187 reference number', () => {
    expect(isJAC00187('PRODUCTION', 'JAC00187')).toBe(true);
  });

  it('returns false for invalid environment', () => {
    expect(isJAC00187('INVALID', 'JAC00696')).toBe(false);
  });

  it('returns false for invalid reference number', () => {
    expect(isJAC00187('DEVELOP', 'INVALID')).toBe(false);
  });

  it('returns false for null environment', () => {
    expect(isJAC00187(null, 'JAC00696')).toBe(false);
  });

  it('returns false for null reference number', () => {
    expect(isJAC00187('DEVELOP', null)).toBe(false);
  });
});
