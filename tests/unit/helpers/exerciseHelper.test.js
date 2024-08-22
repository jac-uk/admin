import {
  getNextStage,
  getStagePassingStatuses,
  getStageMoveBackStatuses,
  getStageWithdrawalStatus,
  availableStatuses,
  availableReportLinks,
  shortlistingStatuses,
  isApplicationVersionGreaterThan,
  isApplicationVersionLessThan,
  isJAC00187
} from '@/helpers/exerciseHelper';
import { EXERCISE_STAGE, SHORTLISTING, APPLICATION_STATUS } from '@/helpers/constants';
import { describe } from 'vitest';

describe('getNextStage', () => {
  it('should return the next stage when a valid new status is provided', () => {
    const exercise = { _processingVersion: 2 };
    expect(getNextStage(exercise, EXERCISE_STAGE.SHORTLISTING, APPLICATION_STATUS.SHORTLISTING_PASSED)).toBe(EXERCISE_STAGE.SELECTION);
  });
});

describe('getStagePassingStatuses', () => {
  it('should return correct statuses when _processingVersion is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.SHORTLISTING)).toEqual([APPLICATION_STATUS.SHORTLISTING_PASSED]);
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.SELECTION)).toEqual([APPLICATION_STATUS.PASSED_RECOMMENDED]);
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.SCC)).toEqual([APPLICATION_STATUS.RECOMMENDED_IMMEDIATE, APPLICATION_STATUS.RECOMMENDED_FUTURE, APPLICATION_STATUS.SECOND_STAGE_PASSED]);
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.RECOMMENDATION)).toEqual([]);
  });
  it('should return correct statuses when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.REVIEW)).toEqual('');
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.SHORTLISTED)).toEqual([APPLICATION_STATUS.INVITED_TO_SELECTION_DAY]);
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.SELECTED)).toEqual([APPLICATION_STATUS.PASSED_SELECTION]);
    expect(getStagePassingStatuses(exercise, EXERCISE_STAGE.RECOMMENDED)).toEqual([APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT, APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT]);
  });
});

describe('getStageMoveBackStatuses', () => {
  it('should return [APPLICATION_STATUS.RECONSIDER] when exercise._processingVersion is >= 2 and stage is EXERCISE_STAGE.RECOMMENDATION', () => {
    const exercise = { _processingVersion: 2 };
    expect(getStageMoveBackStatuses(exercise, EXERCISE_STAGE.RECOMMENDATION)).toEqual([APPLICATION_STATUS.RECONSIDER]);
  });

  it('should return an empty array when stage is undefined or null', () => {
    const exercise = { _processingVersion: 2 };
    expect(getStageMoveBackStatuses(exercise, undefined)).toEqual([]);
    expect(getStageMoveBackStatuses(exercise, null)).toEqual([]);
  });
});

describe('getStageWithdrawalStatus', () => {
  it('should return APPLICATION_STATUS.WITHDRAWN when exercise._processingVersion is 2 or greater', () => {
    const exercise = { _processingVersion: 2 };
    expect(getStageWithdrawalStatus(exercise)).toBe(APPLICATION_STATUS.WITHDRAWN);
  });

  it('should return APPLICATION_STATUS.WITHDREW_APPLICATION when exercise._processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(getStageWithdrawalStatus(exercise)).toBe(APPLICATION_STATUS.WITHDREW_APPLICATION);
  });
});

describe('availableStatuses', () => {
  it('should return statuses for shortlisting stage when processing version is 2 or higher', () => {
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

  it('should return statuses for selection stage when processing version is 2 or higher', () => {
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

  it('should return default statuses when stage is not recognized and processing version is 2 or higher', () => {
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

  it('should return statuses for review stage when processing version is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    const stage = EXERCISE_STAGE.REVIEW;
    const expectedStatuses = [
      APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
      APPLICATION_STATUS.WITHDREW_APPLICATION,
    ];
    expect(availableStatuses(exercise, stage)).toEqual(expect.arrayContaining(expectedStatuses));
  });

  it('should return default statuses when stage is not recognized and processing version is less than 2', () => {
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
  it('should return correct statuses when exercise._processingVersion is less than 2', () => {
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

  it('should return correct statuses when exercise._processingVersion is greater or equal to 2', () => {
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

  it('should return an empty array when exercise is null or undefined', () => {
    expect(shortlistingStatuses(null)).toEqual([]);
    expect(shortlistingStatuses(undefined)).toEqual([]);
  });
});

describe('isApplicationVersionGreaterThan', () => {
  const exercise = { _applicationVersion: 2 };

  it('should return true when exercise._applicationVersion is greater than the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 1)).toBe(true);
  });

  it('should return false when exercise._applicationVersion is less than the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 3)).toBe(false);
  });

  it('should return false when exercise._applicationVersion is equal to the specified version', () => {
    expect(isApplicationVersionGreaterThan(exercise, 2)).toBe(false);
  });

  it('should return false when exercise object is null or undefined', () => {
    expect(isApplicationVersionGreaterThan({}, 3)).toBe(false);
    expect(isApplicationVersionGreaterThan(null, 3)).toBe(false);
    expect(isApplicationVersionGreaterThan(undefined, 3)).toBe(false);
  });
});

describe('isApplicationVersionLessThan', () => {
  const exercise = { _applicationVersion: 2 };

  it('should return true when exercise._applicationVersion is less than the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 3)).toBe(true);
  });

  it('should return false when exercise._applicationVersion is greater than the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 1)).toBe(false);
  });

  it('should return false when exercise._applicationVersion is equal to the specified version', () => {
    expect(isApplicationVersionLessThan(exercise, 2)).toBe(false);
  });

  it('should return false when exercise object is null or undefined', () => {
    expect(isApplicationVersionLessThan({}, 3)).toBe(false);
    expect(isApplicationVersionLessThan(null, 3)).toBe(false);
    expect(isApplicationVersionLessThan(undefined, 3)).toBe(false);
  });
});

describe('isJAC00187', () => {
  it('should return true when env is DEVELOP and referenceNumber is JAC00696', () => {
    expect(isJAC00187('DEVELOP', 'JAC00696')).toBe(true);
  });

  it('should return true when env is STAGING and referenceNumber is JAC00695', () => {
    expect(isJAC00187('STAGING', 'JAC00695')).toBe(true);
  });

  it('should return true when env is PRODUCTION and referenceNumber is JAC00187', () => {
    expect(isJAC00187('PRODUCTION', 'JAC00187')).toBe(true);
  });

  it('should return false when env or referenceNumber is null', () => {
    expect(isJAC00187(null, 'JAC00696')).toBe(false);
    expect(isJAC00187('DEVELOP', null)).toBe(false);
    expect(isJAC00187(null, null)).toBe(false);
  });
});

describe('isJAC00187', () => {
  it('should return true for DEVELOP environment and JAC00696 reference number', () => {
    expect(isJAC00187('DEVELOP', 'JAC00696')).toBe(true);
  });

  it('should return true for STAGING environment and JAC00695 reference number', () => {
    expect(isJAC00187('STAGING', 'JAC00695')).toBe(true);
  });

  it('should return true for PRODUCTION environment and JAC00187 reference number', () => {
    expect(isJAC00187('PRODUCTION', 'JAC00187')).toBe(true);
  });

  it('should return false for invalid environment', () => {
    expect(isJAC00187('INVALID', 'JAC00696')).toBe(false);
  });

  it('should return false for invalid reference number', () => {
    expect(isJAC00187('DEVELOP', 'INVALID')).toBe(false);
  });

  it('should return false for null environment', () => {
    expect(isJAC00187(null, 'JAC00696')).toBe(false);
  });

  it('should return false for null reference number', () => {
    expect(isJAC00187('DEVELOP', null)).toBe(false);
  });
});
