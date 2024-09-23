import {
  APPLICATION_STEPS,
  PROCESSING_STAGE,
  TASK_STATUS,
  getNextProcessingStage,
  getProcessingEntryStage,
  getProcessingExitStage,
  getTimelineTasks,
  getTaskTypes,
  getTaskCurrentStep,
  getTaskSteps,
  taskStatuses,
  getMeritListTaskTypes,
  previousTaskType,
  taskEntryStatus,
  emptyScoreSheet,
  applicationCurrentStep,
  isReadyForApproval,
  isReadyForApprovalFromAdvertType,
  isApprovalRejected,
  isEditable,
  isArchived,
  isApproved,
  isProcessing,
  isClosed,
  applicationCounts,
  applicationRecordCounts,
  exerciseStates,
  exerciseAdvertTypes,
  applicationContentSteps,
  configuredApplicationContentSteps,
  hasIndependentAssessments,
  hasLeadershipJudgeAssessment,
  hasQualifyingTests,
  hasScenarioTest,
  hasRelevantMemberships,
  hasStatementOfSuitability,
  hasCoveringLetter,
  hasCV,
  hasStatementOfEligibility,
  hasSelfAssessment,
  isLegal,
  isNonLegal,
  isTribunal,
  isWelshAdministrationRequired,
  isSpeakWelshRequired,
  isReadWriteWelshRequired,
  isApplyingForWelshPost,
  currentState,
  applicationContentList,
  exerciseApplicationParts,
  getExerciseSaveData,
  applicationPartsMap,
  selectedApplicationParts,
  unselectedApplicationParts,
  configuredApplicationParts,
  applicationParts,
  currentApplicationParts,
  isApplicationPartAsked,
  isCharacterChecksAsked,
  isMoreInformationNeeded,
  isApplicationComplete,
  hasApplicationProcess,
  availableStages,
  getPreviousStage,
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
import { ADVERT_TYPES, EXERCISE_STAGE, SHORTLISTING, APPLICATION_STATUS, TASK_TYPE, ASSESSMENT_METHOD } from '@/helpers/constants';

describe('getNextProcessingStage', () => {
  it('should return the next processing stage when given a valid current stage', () => {
    expect(getNextProcessingStage(PROCESSING_STAGE.SHORTLISTING)).toBe(PROCESSING_STAGE.SELECTION);
    expect(getNextProcessingStage(PROCESSING_STAGE.SELECTION)).toBe(PROCESSING_STAGE.SCC);
    expect(getNextProcessingStage(PROCESSING_STAGE.SCC)).toBe(PROCESSING_STAGE.RECOMMENDATION);
    expect(getNextProcessingStage(PROCESSING_STAGE.RECOMMENDATION)).toBe(PROCESSING_STAGE.HANDOVER);
  });
});

describe('getProcessingEntryStage', () => {
  it('should return correct entry stage when _processingVersion is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    expect(getProcessingEntryStage(exercise, 'all')).toBe(EXERCISE_STAGE.SHORTLISTING);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.SHORTLISTING)).toBe(EXERCISE_STAGE.SHORTLISTING);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.SELECTION)).toBe(EXERCISE_STAGE.SELECTION);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.SCC)).toBe(EXERCISE_STAGE.SCC);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.RECOMMENDATION)).toBe(EXERCISE_STAGE.RECOMMENDATION);
  });

  it('should return correct entry stage when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.SHORTLISTING)).toBe(EXERCISE_STAGE.REVIEW);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.SELECTION)).toBe(EXERCISE_STAGE.SHORTLISTED);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.RECOMMENDATION)).toBe(EXERCISE_STAGE.SELECTED);
    expect(getProcessingEntryStage(exercise, PROCESSING_STAGE.HANDOVER)).toBe(EXERCISE_STAGE.RECOMMENDED);
  });
});

describe('getProcessingExitStage', () => {
  it('should return correct exit stage when _processingVersion is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    expect(getProcessingExitStage(exercise, 'all')).toBe(EXERCISE_STAGE.SELECTION);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.SHORTLISTING)).toBe(EXERCISE_STAGE.SELECTION);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.SELECTION)).toBe(EXERCISE_STAGE.SCC);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.SCC)).toBe(EXERCISE_STAGE.RECOMMENDATION);
  });

  it('should return correct entry stage when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.SHORTLISTING)).toBe(EXERCISE_STAGE.SHORTLISTED);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.SELECTION)).toBe(EXERCISE_STAGE.SELECTED);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.RECOMMENDATION)).toBe(EXERCISE_STAGE.RECOMMENDED);
    expect(getProcessingExitStage(exercise, PROCESSING_STAGE.HANDOVER)).toBe(EXERCISE_STAGE.HANDOVER);
  });
});

describe('getTimelineTasks', () => {
  it('should return correct timeline tasks when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(getTimelineTasks(exercise)).toEqual([
      {
        entry: 'Situational judgement qualifying test (QT)',
        date: new Date('2024-01-01 21:00'),
        endDate: new Date('2024-01-01 21:00'),
        dateString: '1 January 2024 - 7:00 am to 9:00 pm',
        taskType: 'situationalJudgement',
      },
    ]);
  });
});

describe('getTaskTypes', () => {
  it('should return correct task types when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(getTaskTypes(exercise)).toEqual(['situationalJudgement']);
  });
});

describe('getTaskCurrentStep', () => {
  it('should return correct current step when a valid task status is provided', () => {
    const exercise = {};
    expect(getTaskCurrentStep(exercise, TASK_STATUS.CANDIDATE_FORM_CONFIGURE)).toStrictEqual({ title: 'Configure candidate form' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.CANDIDATE_FORM_MONITOR)).toStrictEqual({ title: 'Monitor candidate responses' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.DATA_INITIALISED)).toStrictEqual({ title: 'Configure marking scheme' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.DATA_ACTIVATED)).toStrictEqual({ title: 'Enter scores' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.TEST_INITIALISED)).toStrictEqual({ title: 'Test preparation' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.TEST_ACTIVATED)).toStrictEqual({ title: 'Test active' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.PANELS_INITIALISED)).toStrictEqual({ title: 'Configure panels' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.PANELS_ACTIVATED)).toStrictEqual({ title: 'Panel scores' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.MODERATION_INITIALISED)).toStrictEqual({ title: 'Configure moderation' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.MODERATION_ACTIVATED)).toStrictEqual({ title: 'Moderation scores' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.STATUS_CHANGES)).toStrictEqual({ title: 'Update statuses' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.STAGE_OUTCOME)).toStrictEqual({ title: 'Confirm outcomes' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.FINALISED)).toStrictEqual({ title: 'Merit list' });
    expect(getTaskCurrentStep(exercise, TASK_STATUS.COMPLETED)).toStrictEqual({ title: 'Completed' });
  });
});

describe('getTaskSteps', () => {
  it('should return correct task steps when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(getTaskSteps(exercise)).toEqual([{ id: 'new', title: 'Overview' }]);
  });
});

describe('taskStatuses', () => {
  it('should return correct statuses when task type is CRITICAL_ANALYSIS and SITUATIONAL_JUDGEMENT', () => {
    const expectedStatuses = [
      TASK_STATUS.TEST_INITIALISED,
      TASK_STATUS.TEST_ACTIVATED,
      TASK_STATUS.FINALISED,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.CRITICAL_ANALYSIS)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.SITUATIONAL_JUDGEMENT)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is QUALIFYING_TEST', () => {
    const expectedStatuses = [
      TASK_STATUS.FINALISED,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.QUALIFYING_TEST)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is SCENARIO and EMP_TIEBREAKER', () => {
    const expectedStatuses = [
      TASK_STATUS.TEST_INITIALISED,
      TASK_STATUS.TEST_ACTIVATED,
      TASK_STATUS.DATA_ACTIVATED,
      TASK_STATUS.FINALISED,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.SCENARIO)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.EMP_TIEBREAKER)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is TELEPHONE_ASSESSMENT, ELIGIBILITY_SCC, STATUTORY_CONSULTATION, and CHARACTER_AND_SELECTION_SCC', () => {
    const expectedStatuses = [
      TASK_STATUS.STATUS_CHANGES,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.TELEPHONE_ASSESSMENT)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.ELIGIBILITY_SCC)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.STATUTORY_CONSULTATION)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.CHARACTER_AND_SELECTION_SCC)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is PRE_SELECTION_DAY_QUESTIONNAIRE', () => {
    const expectedStatuses = [
      TASK_STATUS.CANDIDATE_FORM_CONFIGURE,
      TASK_STATUS.CANDIDATE_FORM_MONITOR,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is SIFT', () => {
    const expectedStatuses = [
      TASK_STATUS.DATA_INITIALISED,
      TASK_STATUS.PANELS_INITIALISED,
      TASK_STATUS.PANELS_ACTIVATED,
      TASK_STATUS.FINALISED,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.SIFT)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is SELECTION_DAY', () => {
    const expectedStatuses = [
      TASK_STATUS.DATA_INITIALISED,
      TASK_STATUS.PANELS_INITIALISED,
      TASK_STATUS.PANELS_ACTIVATED,
      TASK_STATUS.FINALISED,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.SELECTION_DAY)).toEqual(expectedStatuses);
  });

  it('should return correct statuses when task type is SHORTLISTING_OUTCOME and SELECTION_OUTCOME', () => {
    const expectedStatuses = [
      TASK_STATUS.STAGE_OUTCOME,
      TASK_STATUS.COMPLETED,
    ];
    expect(taskStatuses(TASK_TYPE.SHORTLISTING_OUTCOME)).toEqual(expectedStatuses);
    expect(taskStatuses(TASK_TYPE.SELECTION_OUTCOME)).toEqual(expectedStatuses);
  });

  it('should return empty when task type is invalid', () => {
    expect(taskStatuses(null)).toEqual([]);
    expect(taskStatuses(undefined)).toEqual([]);
    expect(taskStatuses('')).toEqual([]);
  });
});

describe('getMeritListTaskTypes', () => {
  it('should return correct task types when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(getMeritListTaskTypes(exercise)).toEqual(['situationalJudgement']);
  });
});

describe('previousTaskType', () => {
  it('should return empty when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(previousTaskType(exercise)).toEqual('');
  });
});

describe('taskEntryStatus', () => {
  it('should return correct status when shortlisting method is situational judgement', () => {
    const exercise = {
      shortlistingMethods: ['situational-judgement-qualifying-test'],
      situationalJudgementTestDate: new Date('2024-01-01'),
      situationalJudgementTestStartTime: new Date('2024-01-01 07:00'),
      situationalJudgementTestEndTime: new Date('2024-01-01 21:00'),
    };
    expect(taskEntryStatus(exercise, TASK_TYPE.SITUATIONAL_JUDGEMENT)).toBe('');
  });
});

describe('emptyScoreSheet', () => {
  it('should return a full score sheet when no type is specified', () => {
    const result = emptyScoreSheet({});
    expect(result).toHaveProperty('sift');
    expect(result).toHaveProperty('selection');
    expect(result.sift.scoreSheet).toEqual({
      'L&J': '',
      'PQ': '',
      'L': '',
      'EJ': '',
      'PBK': '',
      'ACI': '',
      'WCO': '',
      'MWE': '',
      'OVERALL': '',
    });
    expect(result.selection.scoreSheet.leadership).toEqual({
      'L&J': '',
      'PQ': '',
      'L': '',
      'EJ': '',
      'PBK': '',
      'ACI': '',
      'WCO': '',
      'MWE': '',
      'OVERALL': '',
    });
    expect(result.selection.scoreSheet.roleplay).toEqual({
      'L&J': '',
      'PQ': '',
      'L': '',
      'EJ': '',
      'PBK': '',
      'ACI': '',
      'WCO': '',
      'MWE': '',
      'OVERALL': '',
    });
    expect(result.selection.scoreSheet.interview).toEqual({
      'L&J': '',
      'PQ': '',
      'L': '',
      'EJ': '',
      'PBK': '',
      'ACI': '',
      'WCO': '',
      'MWE': '',
      'OVERALL': '',
    });
    expect(result.selection.scoreSheet.overall).toEqual({
      'L&J': '',
      'PQ': '',
      'L': '',
      'EJ': '',
      'PBK': '',
      'ACI': '',
      'WCO': '',
      'MWE': '',
      'OVERALL': '',
    });
  });
});

describe('applicationCurrentStep', () => {
  it('should return "passedTests" when exercise has qualifying tests and application status is QUALIFYING_TEST_PASSED', () => {
    const exercise = {
      _processingVersion: 2,
      shortlistingMethods: ['situational-judgement-qualifying-test'],
    };
    const application = {
      _processing: {
        stage: EXERCISE_STAGE.SHORTLISTING,
        status: APPLICATION_STATUS.QUALIFYING_TEST_PASSED,
      },
    };
    expect(applicationCurrentStep(exercise, application)).toBe('passedTests');
  });

  it('should return null when application._processing is undefined', () => {
    const exercise = {};
    const application = {};
    expect(applicationCurrentStep(exercise, application)).toBeNull();
  });
});

describe('isReadyForApproval', () => {
  it('should return true when exercise state is ready', () => {
    const exercise = { state: 'ready' };
    expect(isReadyForApproval(exercise)).toBe(true);
  });

  it('should return false when exercise is null', () => {
    expect(isReadyForApproval(null)).toBe(false);
  });
});

describe('isReadyForApprovalFromAdvertType', () => {
  it('should return true when exercise advertType is undefined', () => {
    const exercise = {};
    expect(isReadyForApprovalFromAdvertType(exercise)).toBe(true);
  });

  it('should return true when exercise advertType is FULL', () => {
    const exercise = { advertType: ADVERT_TYPES.FULL };
    expect(isReadyForApprovalFromAdvertType(exercise)).toBe(true);
  });

  it('should return true when exercise advertType is EXTERNAL', () => {
    const exercise = { advertType: ADVERT_TYPES.EXTERNAL };
    expect(isReadyForApprovalFromAdvertType(exercise)).toBe(true);
  });

  it('should return true when exercise advertType is LISTING', () => {
    const exercise = { advertType: ADVERT_TYPES.LISTING };
    expect(isReadyForApprovalFromAdvertType(exercise)).toBe(true);
  });

  it('should return false when exercise is null', () => {
    expect(isReadyForApprovalFromAdvertType(null)).toBe(false);
  });
});

describe('isApprovalRejected', () => {
  it('should return true when exercise state is draft', () => {
    const exercise = {
      state: 'draft',
      _approval: { status: 'rejected' },
    };
    expect(isApprovalRejected(exercise)).toBe(true);
  });

  it('should return true when exercise state is ready', () => {
    const exercise = {
      state: 'ready',
      _approval: { status: 'rejected' },
    };
    expect(isApprovalRejected(exercise)).toBe(true);
  });

  it('should return false when exercise is null', () => {
    expect(isApprovalRejected(null)).toBe(false);
  });
});

describe('isEditable', () => {
  it('should return true when exercise state is draft', () => {
    const exercise = { state: 'draft' };
    expect(isEditable(exercise)).toBe(true);
  });

  it('should return false when exercise state is ready', () => {
    const exercise = { state: 'ready' };
    expect(isEditable(exercise)).toBe(false);
  });

  it('should return false when exercise state is invalid', () => {
    expect(isEditable({})).toBe(false);
    expect(isEditable({ state: null })).toBe(false);
  });
});

describe('isArchived', () => {
  it('should return true when exercise state is archived', () => {
    const exercise = { state: 'archived' };
    expect(isArchived(exercise)).toBe(true);
  });

  it('should return false when exercise state is not archived', () => {
    expect(isArchived({})).toBe(false);
    expect(isArchived({ state: null })).toBe(false);
    expect(isArchived({ state: 'ready' })).toBe(false);
  });
});

describe('isApproved', () => {
  it('should return false when exercise state is draft or ready', () => {
    expect(isApproved({ state: 'draft' })).toBe(false);
    expect(isApproved({ state: 'ready' })).toBe(false);
  });

  it('should return true when exercise state is not draft or ready', () => {
    expect(isApproved({})).toBe(true);
    expect(isApproved({ state: '' })).toBe(true);
    expect(isApproved({ state: null })).toBe(true);
    expect(isApproved({ state: 'archived' })).toBe(true);
  });
});

describe('isProcessing', () => {
  it('should return true when exercise._applicationRecords exists', () => {
    const exercise = { _applicationRecords: {} };
    expect(isProcessing(exercise)).toBe(true);
  });

  it('should return false when exercise._applicationRecords does not exist', () => {
    expect(isProcessing({})).toBe(false);
  });
});

describe('isClosed', () => {
  it('should return true when exercise is approved and applicationCloseDate is in the past', () => {
    const exercise = {
      state: 'approved',
      applicationCloseDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    };
    expect(isClosed(exercise)).toBe(true);
  });

  it('should return false when exercise is not approved', () => {
    const exercise = {
      state: 'draft',
      applicationCloseDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    };
    expect(isClosed(exercise)).toBe(false);
  });

  it('should return false when applicationCloseDate is not in the past', () => {
    const exercise = {
      state: 'approved',
      applicationCloseDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    expect(isClosed(exercise)).toBe(false);
  });
});

describe('applicationCounts', () => {
  it('should return correct object when _applications exists', () => {
    const exercise = {
      _applications: {
        draft: 1,
        applied: 2,
      },
    };
    expect(applicationCounts(exercise)).toEqual({
      draft: 1,
      applied: 2,
    });
  });

  it('should return empty object when _applications does not exist', () => {
    const exercise = {};
    expect(applicationCounts(exercise)).toEqual({});
  });
});

describe('applicationRecordCounts', () => {
  it('should return correct object when _applicationRecords exists', () => {
    const exercise = {
      _applicationRecords: { review: 1 },
    };
    expect(applicationRecordCounts(exercise)).toEqual({ review: 1 });
  });

  it('should return empty object when _applicationRecords does not exist', () => {
    const exercise = {};
    expect(applicationRecordCounts(exercise)).toEqual({});
  });
});

describe('exerciseStates', () => {
  it('should return correct stages when exercise exists', () => {
    const exercise = {};
    expect(exerciseStates(exercise)).toEqual(['shortlisting', 'selection', 'recommendation', 'recommended', 'handover']);
  });

  it('should return empty array when exercise does not exist', () => {
    expect(exerciseStates()).toEqual([]);
  });
});

describe('exerciseAdvertTypes', () => {
  it('should return correct advert types when exercise exists', () => {
    const exercise = {};
    expect(exerciseAdvertTypes(exercise)).toEqual(Object.values(ADVERT_TYPES));
  });

  it('should return empty array when exercise does not exist', () => {
    expect(exerciseAdvertTypes()).toEqual([]);
  });
});

describe('applicationContentSteps', () => {
  it('should return correct steps when _processingVersion is equal or greater than 2', () => {
    const exercise = { _processingVersion: 2 };
    expect(applicationContentSteps(exercise)).toEqual([EXERCISE_STAGE.SELECTION, EXERCISE_STAGE.SCC, EXERCISE_STAGE.RECOMMENDATION]);
  });

  it('should return correct steps when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(applicationContentSteps(exercise)).toEqual([EXERCISE_STAGE.SHORTLISTED, EXERCISE_STAGE.SELECTED, EXERCISE_STAGE.RECOMMENDED]);
  });

  it('should return an empty array when exercise does not exist', () => {
    expect(applicationContentSteps(null)).toEqual([]);
    expect(applicationContentSteps(undefined)).toEqual([]);
  });
});

describe('configuredApplicationContentSteps', () => {
  it('should return filtered steps when exercise and _applicationContent are valid', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(configuredApplicationContentSteps(exercise)).toEqual([EXERCISE_STAGE.SHORTLISTED]);
  });

  it('should return an empty array when _applicationContent does not exist', () => {
    const exercise = {};
    expect(configuredApplicationContentSteps(exercise)).toEqual([]);
  });
});

describe('hasIndependentAssessments', () => {
  it('should return true when independentAssessments is true', () => {
    const exercise = { assessmentMethods: { independentAssessments: true } };
    expect(hasIndependentAssessments(exercise)).toBe(true);
  });

  it('should return false when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: { independentAssessments: false } };
    expect(hasIndependentAssessments(exercise)).toBe(false);
  });
});

describe('hasLeadershipJudgeAssessment', () => {
  it('should return true when leadershipJudgeAssessment is true', () => {
    const exercise = {
      assessmentMethods: {
        leadershipJudgeAssessment: true,
      },
    };
    expect(hasLeadershipJudgeAssessment(exercise)).toBe(true);
  });

  it('should return false when leadershipJudgeAssessment is false', () => {
    const exercise = {
      assessmentMethods: {
        leadershipJudgeAssessment: false,
      },
    };
    expect(hasLeadershipJudgeAssessment(exercise)).toBe(false);
  });
});

describe('hasQualifyingTests', () => {
  it('should return true when "situational-judgement-qualifying-test" is in shortlistingMethods', () => {
    const exercise = { shortlistingMethods: ['situational-judgement-qualifying-test'] };
    expect(hasQualifyingTests(exercise)).toBe(true);
  });

  it('should return true when "critical-analysis-qualifying-test" is in shortlistingMethods', () => {
    const exercise = { shortlistingMethods: ['critical-analysis-qualifying-test'] };
    expect(hasQualifyingTests(exercise)).toBe(true);
  });

  it('should return true when "scenario-test-qualifying-test" is in shortlistingMethods', () => {
    const exercise = { shortlistingMethods: ['scenario-test-qualifying-test'] };
    expect(hasQualifyingTests(exercise)).toBe(true);
  });

  it('should return false when shortlistingMethods is empty', () => {
    const exercise = { shortlistingMethods: [] };
    expect(hasQualifyingTests(exercise)).toBe(false);
  });
});

describe('hasScenarioTest', () => {
  it('should return true when "scenario-test-qualifying-test" is in shortlistingMethods', () => {
    const exercise = { shortlistingMethods: ['scenario-test-qualifying-test'] };
    expect(hasScenarioTest(exercise)).toBe(true);
  });

  it('should return false when shortlistingMethods is empty', () => {
    const exercise = { shortlistingMethods: [] };
    expect(hasScenarioTest(exercise)).toBe(false);
  });
});

describe('hasRelevantMemberships', () => {
  it('should return true when exercise is non-legal and memberships array does not contain "none"', () => {
    const exercise = {
      typeOfExercise: 'non-legal',
      memberships: ['member1', 'member2'],
    };
    expect(hasRelevantMemberships(exercise)).toBe(true);
  });

  it('should return false when exercise is non-legal and memberships array contains only "none"', () => {
    const exercise = {
      typeOfExercise: 'non-legal',
      memberships: ['none'],
    };
    expect(hasRelevantMemberships(exercise)).toBe(false);
  });
});

describe('hasStatementOfSuitability', () => {
  it('should return true when assessmentMethods contains STATEMENT_OF_SUITABILITY_WITH_COMPETENCIES', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_COMPETENCIES]: true,
      },
    };
    expect(hasStatementOfSuitability(exercise)).toBe(true);
  });

  it('should return true when assessmentMethods contains STATEMENT_OF_SUITABILITY_WITH_SKILLS_AND_ABILITIES', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_SKILLS_AND_ABILITIES]: true,
      },
    };
    expect(hasStatementOfSuitability(exercise)).toBe(true);
  });

  it('should return null when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: null };
    expect(hasStatementOfSuitability(exercise)).toBeNull();
  });
});

describe('hasCoveringLetter', () => {
  it('should return true when assessmentMethods contains COVERING_LETTER', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.COVERING_LETTER]: true,
      },
    };
    expect(hasCoveringLetter(exercise)).toBe(true);
  });

  it('should return null when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: null };
    expect(hasCoveringLetter(exercise)).toBeNull();
  });
});

describe('hasCV', () => {
  it('should return true when assessmentMethods contains CV', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.CV]: true,
      },
    };
    expect(hasCV(exercise)).toBe(true);
  });

  it('should return null when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: null };
    expect(hasCV(exercise)).toBeNull();
  });
});

describe('hasStatementOfEligibility', () => {
  it('should return true when assessmentMethods contains STATEMENT_OF_ELIGIBILITY', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.STATEMENT_OF_ELIGIBILITY]: true,
      },
      aSCApply: true,
      selectionCriteria: ['criteria1'],
    };
    expect(hasStatementOfEligibility(exercise)).toBe(true);
  });

  it('should return null when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: null };
    expect(hasStatementOfEligibility(exercise)).toBeNull();
  });
});

describe('hasSelfAssessment', () => {
  it('should return true when assessmentMethods contains SELF_ASSESSMENT_WITH_COMPETENCIES', () => {
    const exercise = {
      assessmentMethods: {
        [ASSESSMENT_METHOD.SELF_ASSESSMENT_WITH_COMPETENCIES]: true,
      },
    };
    expect(hasSelfAssessment(exercise)).toBe(true);
  });

  it('should return null when assessmentMethods is empty', () => {
    const exercise = { assessmentMethods: null };
    expect(hasSelfAssessment(exercise)).toBeNull();
  });
});

describe('isLegal', () => {
  it('should return true when exercise.typeOfExercise is legal or leadership', () => {
    expect(isLegal({ typeOfExercise: 'legal' })).toBe(true);
    expect(isLegal({ typeOfExercise: 'leadership' })).toBe(true);
  });

  it('should return false when exercise.typeOfExercise is legal', () => {
    const exercise = { typeOfExercise: 'non-legal' };
    expect(isLegal(exercise)).toBe(false);
  });
});

describe('isNonLegal', () => {
  it('should return true when exercise.typeOfExercise is non-legal or leadership-non-legal', () => {
    expect(isNonLegal({ typeOfExercise: 'non-legal' })).toBe(true);
    expect(isNonLegal({ typeOfExercise: 'leadership-non-legal' })).toBe(true);
  });

  it('should return false when exercise.typeOfExercise is legal', () => {
    const exercise = { typeOfExercise: 'legal' };
    expect(isNonLegal(exercise)).toBe(false);
  });
});

describe('isTribunal', () => {
  it('should return true when exercise.isCourtOrTribunal is tribunal', () => {
    const exercise = { isCourtOrTribunal: 'tribunal' };
    expect(isTribunal(exercise)).toBe(true);
  });

  it('should return false when exercise.isCourtOrTribunal is undefined', () => {
    const exercise = {};
    expect(isTribunal(exercise)).toBe(false);
  });
});

describe('isWelshAdministrationRequired', () => {
  it('should return true when welsh-administration-questions is in exercise.welshRequirementType', () => {
    const exercise = { welshRequirementType: ['welsh-administration-questions'] };
    expect(isWelshAdministrationRequired(exercise)).toBe(true);
  });

  it('should return false when exercise.welshRequirementType is an empty array', () => {
    const exercise = { welshRequirementType: [] };
    expect(isWelshAdministrationRequired(exercise)).toBe(false);
  });
});

describe('isSpeakWelshRequired', () => {
  it('should return true when welsh-speaking is included in exercise.welshRequirementType', () => {
    const exercise = { welshRequirementType: ['welsh-speaking'] };
    expect(isSpeakWelshRequired(exercise)).toBe(true);
  });

  it('should return false when exercise.welshRequirementType is an empty array', () => {
    const exercise = { welshRequirementType: [] };
    expect(isSpeakWelshRequired(exercise)).toBe(false);
  });
});

describe('isReadWriteWelshRequired', () => {
  it('should return true when welsh-reading-writing is in exercise.welshRequirementType', () => {
    const exercise = { welshRequirementType: ['welsh-reading-writing'] };
    expect(isReadWriteWelshRequired(exercise)).toBe(true);
  });

  it('should return false when exercise.welshRequirementType is an empty array', () => {
    const exercise = { welshRequirementType: [] };
    expect(isReadWriteWelshRequired(exercise)).toBe(false);
  });
});

describe('isApplyingForWelshPost', () => {
  it('should return true when both exercise.welshRequirement and application.applyingForWelshPost are true', () => {
    const exercise = { welshRequirement: true };
    const application = { applyingForWelshPost: true };
    expect(isApplyingForWelshPost(exercise, application)).toBe(true);
  });

  it('should return false when exercise.welshRequirement is false', () => {
    const exercise = { welshRequirement: false };
    const application = { applyingForWelshPost: true };
    expect(isApplyingForWelshPost(exercise, application)).toBe(false);
  });

  it('should return false when application.applyingForWelshPost is false', () => {
    const exercise = { welshRequirement: true };
    const application = { applyingForWelshPost: false };
    expect(isApplyingForWelshPost(exercise, application)).toBe(false);
  });
});

describe('currentState', () => {
  it('should return correct state when _currentStep exists', () => {
    APPLICATION_STEPS.forEach((step) => {
      const exercise = { _applicationContent: { _currentStep: { step } } };
      expect(currentState(exercise)).toBe(step);
    });
  });

  it('should return "registration" when _applicationContent is null', () => {
    const data = { _applicationContent: null };
    const result = currentState(data);
    expect(result).toBe('registration');
  });
});

describe('applicationContentList', () => {
  it('should return correct data when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          assessorsDetails: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        passedTests: {},
        recommended: {},
        selected: {},
        shortlisted: {},
      },
      _processingVersion: 1,
    };
    expect(applicationContentList(exercise)).toEqual([
      {
        ref: 'registration',
        parts: [
          'personalDetails',
          'characterInformation',
          'equalityAndDiversitySurvey',
          'assessorsDetails',
          'additionalInfo',
        ],
      },
      { ref: 'shortlisted', parts: [] },
      { ref: 'selected', parts: [] },
      { ref: 'recommended', parts: [] },
    ]);
  });

  it('should return an empty array when _applicationContent does not exist', () => {
    const exercise = {};
    expect(applicationContentList(exercise)).toEqual([]);
  });
});

describe('exerciseApplicationParts', () => {
  it('should return correct application parts when exercise is legal', () => {
    const exercise = {
      typeOfExercise: 'legal',
    };
    expect(exerciseApplicationParts(exercise)).toEqual([
      'personalDetails',
      'characterInformation',
      'equalityAndDiversitySurvey',
      'relevantQualifications',
      'postQualificationWorkExperience',
      'reasonableLengthOfService',
      'assessorsDetails',
      'commissionerConflicts',
      'additionalInfo',
    ]);
  });

  it('should return correct application parts when exercise is non-legal', () => {
    const exercise = {
      typeOfExercise: 'non-legal',
    };
    expect(exerciseApplicationParts(exercise)).toEqual([
      'personalDetails',
      'characterInformation',
      'equalityAndDiversitySurvey',
      'relevantExperience',
      'employmentGaps',
      'reasonableLengthOfService',
      'assessorsDetails',
      'commissionerConflicts',
      'additionalInfo',
    ]);
  });
});

describe('getExerciseSaveData', () => {
  it('should return correct save data', () => {
    const exercise = {
      _applicationContent: {
        _currentStep: { step: 'registration' },
        registration: ['personalDetails', 'additionalInfo'],
      },
    };
    expect(getExerciseSaveData(exercise, {})).toEqual({
      _applicationContent: {
        registration: {
          personalDetails: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          assessorsDetails: true,
          commissionerConflicts: true,
          additionalInfo: true,
        },
        passedTests: {},
        shortlisted: {},
        selected: {},
        recommended: {},
        selection: {},
        scc: {},
        recommendation: {},
        _currentStep: { step: 'registration' },
      },
    });
  });
});

describe('applicationPartsMap', () => {
  it('should return correct data when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        _currentStep: { step: 'registration' },
        registration: ['personalDetails', 'additionalInfo'],
      },
    };
    expect(applicationPartsMap(exercise)).toEqual({
      personalDetails: true,
      characterInformation: true,
      equalityAndDiversitySurvey: true,
      assessorsDetails: true,
      commissionerConflicts: true,
      additionalInfo: true,
    });
  });
});

describe('selectedApplicationParts', () => {
  it('should return an array of parts when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: false,
          characterInformation: false,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(selectedApplicationParts(exercise)).toEqual([
      'equalityAndDiversitySurvey',
      'personalDetails',
      'postQualificationWorkExperience',
      'assessorsDetails',
    ]);
  });
});

describe('unselectedApplicationParts', () => {
  it('should return an array of parts when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: false,
          characterInformation: false,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(unselectedApplicationParts(exercise)).toEqual([
      'characterInformation',
      'commissionerConflicts',
      'additionalInfo',
    ]);
  });
});

describe('configuredApplicationParts', () => {
  it('should return an array of parts when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: false,
          characterInformation: false,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(configuredApplicationParts(exercise)).toEqual([
      'additionalInfo',
      'characterInformation',
      'equalityAndDiversitySurvey',
      'personalDetails',
      'postQualificationWorkExperience',
      'assessorsDetails',
    ]);
  });

  it('should return an empty array when _applicationContent does not exist', () => {
    const exercise = {};
    expect(configuredApplicationParts(exercise)).toEqual([]);
  });
});

describe('applicationParts', () => {
  it('should return an object with parts set to true when exercise contains application content', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: false,
          characterInformation: false,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(applicationParts(exercise)).toEqual({
      personalDetails: true,
      equalityAndDiversitySurvey: true,
    });
  });

  it('should return an empty object when _applicationContent does not exist', () => {
    const exercise = {};
    expect(applicationParts(exercise)).toEqual({});
  });
});

describe('currentApplicationParts', () => {
  it('should return current application parts when _applicationContent exists', () => {
    APPLICATION_STEPS.forEach((step) => {
      const exercise = {
        _applicationContent: {
          _currentStep: { step },
          [step]: ['part1', 'part2'],
        },
      };
      expect(currentApplicationParts(exercise)).toEqual(['part1', 'part2']);
    });
  });

  it('should return an empty array when _applicationContent does not exist', () => {
    const exercise = {};
    expect(currentApplicationParts(exercise)).toEqual([]);
  });
});

describe('isApplicationPartAsked', () => {
  it('should return true when application part is asked in current stage', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: false,
          characterInformation: false,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(isApplicationPartAsked(exercise, 'additionalInfo')).toBe(false);
    expect(isApplicationPartAsked(exercise, 'characterInformation')).toBe(false);
    expect(isApplicationPartAsked(exercise, 'equalityAndDiversitySurvey')).toBe(true);
    expect(isApplicationPartAsked(exercise, 'personalDetails')).toBe(true);
  });
});

describe('isCharacterChecksAsked', () => {
  it ('should return true when characterChecks status is requested', () => {
    const application = { characterChecks: { status: 'requested' } };
    expect(isCharacterChecksAsked(application)).toBe(true);
  });

  it ('should return true when characterChecks status is requested', () => {
    const application = { characterChecks: { status: 'not requested' } };
    expect(isCharacterChecksAsked(application)).toBe(false);
  });
});

describe('isMoreInformationNeeded', () => {
  it('should return true when application.progress is complete', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        passedTests: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {},
        _currentStep: {
          step: 'passedTests',
          start: new Date(),
          end: (new Date()).setDate((new Date()).getDate() + 1),
        },
      },
      _processingVersion: 2,
      shortlistingMethods: ['situational-judgement-qualifying-test'],
    };
    const application = {
      _processing: {
        stage: EXERCISE_STAGE.SHORTLISTING,
        status: APPLICATION_STATUS.QUALIFYING_TEST_PASSED,
      },
      progress: {
        additionalInfo: true,
        characterInformation: true,
        equalityAndDiversitySurvey: true,
        personalDetails: true,
      },
    };
    expect(isMoreInformationNeeded(exercise, application)).toBe(true);
  });

  it('should return false when _applicationContent does not exist', () => {
    const exercise = {};
    const application = {};
    expect(isMoreInformationNeeded(exercise, application)).toBe(false);
  });
});

describe('isApplicationComplete', () => {
  it('should return true when application.progress is complete', () => {
    const vacancy = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
      },
    };
    const application = {
      progress: {
        additionalInfo: true,
        characterInformation: true,
        equalityAndDiversitySurvey: true,
        personalDetails: true,
      },
    };
    expect(isApplicationComplete(vacancy, application)).toBe(true);
  });

  it('should return true when application.progress is incomplete', () => {
    const vacancy = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
      },
    };
    const application = {
      progress: {
        additionalInfo: false,
        characterInformation: true,
        equalityAndDiversitySurvey: true,
        personalDetails: true,
      },
    };
    expect(isApplicationComplete(vacancy, application)).toBe(false);
  });

  it('should return false when application.progress is undefined', () => {
    const application = {};
    expect(isApplicationComplete({}, application)).toBe(false);
  });
});

describe('hasApplicationProcess', () => {
  it('should return true when _applicationContent exists', () => {
    const exercise = {
      _applicationContent: {
        registration: {
          additionalInfo: true,
          characterInformation: true,
          equalityAndDiversitySurvey: true,
          personalDetails: true,
        },
        recommended: {},
        selected: {},
        shortlisted: {
          postQualificationWorkExperience: true,
          assessorsDetails: true,
        },
      },
      _processingVersion: 1,
    };
    expect(hasApplicationProcess(exercise)).toBe(true);
  });

  it('should return false when _applicationContent does not exist', () => {
    const exercise = {};
    expect(hasApplicationProcess(exercise)).toBe(false);
  });
});

describe('availableStages', () => {
  it('should return available stages when _processingVersion is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    const expectedStages = [
      EXERCISE_STAGE.SHORTLISTING,
      EXERCISE_STAGE.SELECTION,
      EXERCISE_STAGE.SCC,
      EXERCISE_STAGE.RECOMMENDATION,
    ];
    expect(availableStages(exercise)).toStrictEqual(expectedStages);
  });

  it('should return available stages when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    const expectedStages = [
      EXERCISE_STAGE.REVIEW,
      EXERCISE_STAGE.SHORTLISTED,
      EXERCISE_STAGE.SELECTED,
      EXERCISE_STAGE.RECOMMENDED,
      EXERCISE_STAGE.HANDOVER,
    ];
    expect(availableStages(exercise)).toStrictEqual(expectedStages);
  });
});

describe('getPreviousStage', () => {
  it('should return the previous stage when _processingVersion is 2 or higher', () => {
    const exercise = { _processingVersion: 2 };
    expect(getPreviousStage(exercise, EXERCISE_STAGE.SHORTLISTING)).toBe('');
    expect(getPreviousStage(exercise, EXERCISE_STAGE.SELECTION)).toBe(EXERCISE_STAGE.SHORTLISTING);
    expect(getPreviousStage(exercise, EXERCISE_STAGE.SCC)).toBe(EXERCISE_STAGE.SELECTION);
    expect(getPreviousStage(exercise, EXERCISE_STAGE.RECOMMENDATION)).toBe(EXERCISE_STAGE.SCC);
  });

  it('should return the previous stage when _processingVersion is less than 2', () => {
    const exercise = { _processingVersion: 1 };
    expect(getPreviousStage(exercise, EXERCISE_STAGE.REVIEW)).toBe('');
    expect(getPreviousStage(exercise, EXERCISE_STAGE.SHORTLISTED)).toBe(EXERCISE_STAGE.REVIEW);
    expect(getPreviousStage(exercise, EXERCISE_STAGE.SELECTED)).toBe(EXERCISE_STAGE.SHORTLISTED);
    expect(getPreviousStage(exercise, EXERCISE_STAGE.RECOMMENDED)).toBe(EXERCISE_STAGE.SELECTED);
    expect(getPreviousStage(exercise, EXERCISE_STAGE.HANDOVER)).toBe(EXERCISE_STAGE.RECOMMENDED);
  });
});

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
