/*eslint func-style: ["error", "declaration"]*/
import clone from 'clone';
import { ADVERT_TYPES, EXERCISE_STAGE, APPLICATION_STATUS, SHORTLISTING, TASK_TYPE, SHORTLISTING_TASK_TYPES, ASSESSMENT_METHOD } from '@/helpers/constants';
import exerciseTimeline from '../helpersTMP/Timeline/exerciseTimeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';

/** Used in Admin:-
APPLICATION_STEPS,
isEditable,
isLegal,
isNonLegal,
isTribunal,
hasQualifyingTests,
hasRelevantMemberships,
hasStatementOfSuitability,
hasIndependentAssessments,
hasLeadershipJudgeAssessment,
hasCV,
hasCoveringLetter,
hasSelfAssessment,
exerciseApplicationParts,
configuredApplicationParts,
applicationContentList,
unselectedApplicationParts
*/

export {
  APPLICATION_STEPS,
  CAPABILITIES,
  SELECTION_CATEGORIES,
  TASK_STATUS,
  TASK_TYPE,
  STAGE_TASKS,
  getNextProcessingStage,
  getProcessingEntryStage,
  getProcessingExitStage,
  getTimelineTasks,
  getTaskTypes,
  getTaskCurrentStep,
  getTaskSteps,
  getMeritListTaskTypes,
  taskEntryStatus,
  previousTaskType,
  emptyScoreSheet,
  exerciseStates,
  exerciseAdvertTypes,
  applicationContentSteps,
  configuredApplicationContentSteps,
  isReadyForApproval,
  isReadyForApprovalFromAdvertType,
  isApprovalRejected,
  isEditable,
  isApproved,
  isArchived,
  isProcessing,
  isClosed,
  hasIndependentAssessments,
  hasLeadershipJudgeAssessment,
  hasQualifyingTests,
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
  exerciseApplicationParts, // @todo review naming of applicationParts methods :)
  getExerciseSaveData,
  applicationPartsMap,
  applicationParts,
  selectedApplicationParts,
  unselectedApplicationParts,
  configuredApplicationParts,
  currentApplicationParts,
  isApplicationPartAsked,
  isCharacterChecksAsked,
  isMoreInformationNeeded,
  isApplicationComplete,
  hasApplicationProcess,
  applicationCounts,
  applicationRecordCounts,
  availableStages,
  availableStatuses,
  availableReportLinks,
  getPreviousStage,
  getNextStage,
  getStagePassingStatuses,
  getStageMoveBackStatuses,
  getStageWithdrawalStatus,
  isApplicationVersionGreaterThan,
  isApplicationVersionLessThan,
  isJAC00187,
  isPublished
};

// const EXERCISE_STATES = ['draft', 'ready', 'approved', 'shortlisting', 'selection', 'recommendation', 'handover', 'archived'];
// const APPLICATION_CONTENT = {
//   _currentStep: {
//     step: 'passedTests',
//     start: Date,
//     end: Date,
//   },
//   registration: {
//     personalDetails: true,
//   },
//   passedTests: {
//     characterInformation: true,
//   },
// };

// application process config
const APPLICATION_STEPS = [
  'registration',
  'passedTests',
  EXERCISE_STAGE.SHORTLISTED,  // v1
  EXERCISE_STAGE.SELECTED,   // v1
  EXERCISE_STAGE.RECOMMENDED, // v1
  EXERCISE_STAGE.SELECTION, // v2
  EXERCISE_STAGE.SCC, // v2
  EXERCISE_STAGE.RECOMMENDATION, // v2
];
const APPLICATION_PARTS = [
  'personalDetails',
  'characterInformation',
  'equalityAndDiversitySurvey',
  'partTimeWorkingPreferences',
  'locationPreferences',
  'jurisdictionPreferences',
  'additionalWorkingPreferences',
  'welshPosts',
  'relevantQualifications',
  'relevantMemberships',
  'postQualificationWorkExperience',
  'judicialExperience',
  'relevantExperience',
  'employmentGaps',
  'reasonableLengthOfService',
  'assessorsDetails',
  'leadershipJudgeDetails',
  'statementOfSuitability',
  'coveringLetter',
  'cv',
  'statementOfEligibility',
  'selfAssessmentCompetencies',
  'additionalInfo',
  'commissionerConflicts',
];

const CAPABILITIES = ['L&J', 'PQ', 'L', 'EJ', 'PBK', 'ACI', 'WCO', 'MWE', 'OVERALL'];
const SELECTION_CATEGORIES = ['leadership', 'roleplay', 'situational', 'interview', 'overall'];

const PROCESSING_STAGE = {  // could be exercise_stage and existing exercise_stage -> application_stage
  SHORTLISTING: 'shortlisting',
  SELECTION: 'selection',
  SCC: 'scc',
  RECOMMENDATION: 'recommendation',
  HANDOVER: 'handover',
};

const PROCESSING_STAGES = [
  PROCESSING_STAGE.SHORTLISTING,
  PROCESSING_STAGE.SELECTION,
  PROCESSING_STAGE.SCC,
  PROCESSING_STAGE.RECOMMENDATION,
  PROCESSING_STAGE.HANDOVER,
];

const STAGE_TASKS = {};
STAGE_TASKS[PROCESSING_STAGE.SHORTLISTING] = [
  TASK_TYPE.CRITICAL_ANALYSIS,
  TASK_TYPE.SITUATIONAL_JUDGEMENT,
  TASK_TYPE.SCENARIO,
  TASK_TYPE.TELEPHONE_ASSESSMENT,
  TASK_TYPE.SIFT,
  TASK_TYPE.ELIGIBILITY_SCC,
  TASK_TYPE.SHORTLISTING_OUTCOME,
];
STAGE_TASKS[PROCESSING_STAGE.SELECTION] = [
  TASK_TYPE.SELECTION_DAY,
  TASK_TYPE.STATUTORY_CONSULTATION,
  TASK_TYPE.CHARACTER_AND_SELECTION_SCC,
  TASK_TYPE.SELECTION_OUTCOME,
];

const TASK_STATUS = { // aka task STEPS
  CANDIDATE_FORM_CONFIGURE: 'candidateFormConfigure',
  CANDIDATE_FORM_MONITOR: 'candidateFormMonitor',
  DATA_INITIALISED: 'dataInitialised',
  DATA_ACTIVATED: 'dataActivated',
  TEST_INITIALISED: 'testInitialised',
  TEST_ACTIVATED: 'testActivated',
  PANELS_INITIALISED: 'panelsInitialised',
  PANELS_ACTIVATED: 'panelsActivated',
  MODERATION_INITIALISED: 'moderationInitialised',
  MODERATION_ACTIVATED: 'moderationActivated',
  STATUS_CHANGES: 'statusChanges',
  STAGE_OUTCOME: 'stageOutcome',
  FINALISED: 'finalised',
  CHECKS: 'checks',
  COMPLETED: 'completed',
};

const TASK_STEPS = {};
TASK_STEPS.new = { title: 'Overview' };
TASK_STEPS[TASK_STATUS.CANDIDATE_FORM_CONFIGURE] = { title: 'Configure candidate form' };
TASK_STEPS[TASK_STATUS.CANDIDATE_FORM_MONITOR] = { title: 'Monitor candidate responses' };
TASK_STEPS[TASK_STATUS.DATA_INITIALISED] = { title: 'Configure marking scheme' };
TASK_STEPS[TASK_STATUS.DATA_ACTIVATED] = { title: 'Enter scores' };
TASK_STEPS[TASK_STATUS.TEST_INITIALISED] = { title: 'Test preparation' };
TASK_STEPS[TASK_STATUS.TEST_ACTIVATED] = { title: 'Test active' };
TASK_STEPS[TASK_STATUS.PANELS_INITIALISED] = { title: 'Configure panels' };
TASK_STEPS[TASK_STATUS.PANELS_ACTIVATED] = { title: 'Panel scores' };
TASK_STEPS[TASK_STATUS.MODERATION_INITIALISED] = { title: 'Configure moderation' };
TASK_STEPS[TASK_STATUS.MODERATION_ACTIVATED] = { title: 'Moderation scores' };
TASK_STEPS[TASK_STATUS.STATUS_CHANGES] = { title: 'Update statuses' };
TASK_STEPS[TASK_STATUS.STAGE_OUTCOME] = { title: 'Confirm outcomes' };
TASK_STEPS[TASK_STATUS.FINALISED] = { title: 'Merit list' };
TASK_STEPS[TASK_STATUS.COMPLETED] = { title: 'Completed' };

function getNextProcessingStage(processingStage) {
  const currentIndex = PROCESSING_STAGES.indexOf(processingStage);
  if (currentIndex === PROCESSING_STAGES.length) return '';
  return PROCESSING_STAGES[currentIndex + 1];
}

function getProcessingEntryStage(exercise, processingStage) {
  if (exercise._processingVersion >= 2) {
    switch (processingStage) {
    case 'all':
    case PROCESSING_STAGE.SHORTLISTING:
      return EXERCISE_STAGE.SHORTLISTING;
    case PROCESSING_STAGE.SELECTION:
      return EXERCISE_STAGE.SELECTION;
    case PROCESSING_STAGE.SCC:
      return EXERCISE_STAGE.SCC;
    case PROCESSING_STAGE.RECOMMENDATION:
      return EXERCISE_STAGE.RECOMMENDATION;
    }
  } else {
    switch (processingStage) {
    case PROCESSING_STAGE.SHORTLISTING:
      return EXERCISE_STAGE.REVIEW;
    case PROCESSING_STAGE.SELECTION:
      return EXERCISE_STAGE.SHORTLISTED;
    case PROCESSING_STAGE.RECOMMENDATION:
      return EXERCISE_STAGE.SELECTED;
    case PROCESSING_STAGE.HANDOVER:
      return EXERCISE_STAGE.RECOMMENDED;
    }
  }
}

function getProcessingExitStage(exercise, processingStage) {
  if (exercise._processingVersion >= 2) {
    switch (processingStage) {
    case 'all':
    case PROCESSING_STAGE.SHORTLISTING:
      return EXERCISE_STAGE.SELECTION;
    case PROCESSING_STAGE.SELECTION:
      return EXERCISE_STAGE.SCC;
    case PROCESSING_STAGE.SCC:
      return EXERCISE_STAGE.RECOMMENDATION;
    }
  } else {
    switch (processingStage) {
    case PROCESSING_STAGE.SHORTLISTING:
      return EXERCISE_STAGE.SHORTLISTED;
    case PROCESSING_STAGE.SELECTION:
      return EXERCISE_STAGE.SELECTED;
    case PROCESSING_STAGE.RECOMMENDATION:
      return EXERCISE_STAGE.RECOMMENDED;
    case PROCESSING_STAGE.HANDOVER:
      return EXERCISE_STAGE.HANDOVER;
    }
  }
}

/**
 * get task types in sequence
 *  - look at exercise shortlisting and timeline
 *  - return array of tasks
 * get previous task
 * get next task
 * get outcome statuses
 */
function getTimelineTasks(exercise, taskType) {
  const timeline = createTimeline(exerciseTimeline(exercise));
  let timelineTasks = timeline.filter(item => item.taskType && (!taskType || item.taskType === taskType));
  let supportedTaskTypes = [];
  if (exercise._processingVersion >= 3) {
    supportedTaskTypes = [
      TASK_TYPE.TELEPHONE_ASSESSMENT,
      TASK_TYPE.SIFT,
      TASK_TYPE.CRITICAL_ANALYSIS,
      TASK_TYPE.SITUATIONAL_JUDGEMENT,
      TASK_TYPE.QUALIFYING_TEST,
      TASK_TYPE.SCENARIO,
      TASK_TYPE.SHORTLISTING_OUTCOME,
      TASK_TYPE.ELIGIBILITY_SCC,
      TASK_TYPE.STATUTORY_CONSULTATION,
      TASK_TYPE.CHARACTER_AND_SELECTION_SCC,
      TASK_TYPE.EMP_TIEBREAKER,
      TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE,
      TASK_TYPE.SELECTION_DAY,
    ];
  } else {
    supportedTaskTypes = [
      TASK_TYPE.CRITICAL_ANALYSIS,
      TASK_TYPE.SITUATIONAL_JUDGEMENT,
      TASK_TYPE.QUALIFYING_TEST,
      TASK_TYPE.SCENARIO,
      TASK_TYPE.EMP_TIEBREAKER,
    ];
  }
  timelineTasks = timelineTasks.filter(task => supportedTaskTypes.indexOf(task.taskType) >= 0);
  if (timelineTasks.find((item) => item.taskType === TASK_TYPE.SHORTLISTING_OUTCOME)) {  // ensure shortlisting outcome comes after shortlisting methods!
    let shortlistingOutcomeIndex = -1;
    let lastShortlistingMethodIndex = -1;
    timelineTasks.forEach((item, index) => {
      if (item.taskType === TASK_TYPE.SHORTLISTING_OUTCOME) shortlistingOutcomeIndex = index;
      if (
        (SHORTLISTING_TASK_TYPES.indexOf(item.taskType) >= 0)
        && index > lastShortlistingMethodIndex
      ) {
        lastShortlistingMethodIndex = index;
      }
    });
    if (lastShortlistingMethodIndex > shortlistingOutcomeIndex) {
      timelineTasks.splice(lastShortlistingMethodIndex, 0, timelineTasks.splice(shortlistingOutcomeIndex, 1)[0]);
    }
  }
  return timelineTasks;
}

function getTaskTypes(exercise, stage) {
  let taskTypes = getTimelineTasks(exercise).map(item => item.taskType).filter((value, index, thisArray) => thisArray.indexOf(value) === index);
  if (stage && stage !== 'all') {
    taskTypes = taskTypes.filter(taskType => STAGE_TASKS[stage].indexOf(taskType) >= 0);
  }
  const indexCA = taskTypes.indexOf(TASK_TYPE.CRITICAL_ANALYSIS);
  const indexSJ = taskTypes.indexOf(TASK_TYPE.SITUATIONAL_JUDGEMENT);
  if (indexCA >= 0 && indexSJ >= 0) {
    const indexQT = Math.max(indexCA, indexSJ);
    taskTypes.splice(indexQT + 1, 0, TASK_TYPE.QUALIFYING_TEST);
  }
  return taskTypes;
}

function getTaskCurrentStep(exercise, taskStatus) {
  return TASK_STEPS[taskStatus];
}

function getTaskSteps(exercise, taskType, task) {
  const statuses = taskStatuses(taskType);
  const steps = ['new'].concat(statuses).map(status => {
    return {
      id: status,
      ...TASK_STEPS[status],
    };
  });
  if (task) {
    const currentStepIndex = steps.findIndex(step => step.id === task.status);
    return steps.map((step, index) => {
      return {
        ...step,
        completed: task.status === TASK_STATUS.COMPLETED ? true : index < currentStepIndex,
      };
    });
  } else {
    return steps;
  }
}

function taskStatuses(taskType) { // also on DP
  let availableStatuses = [];
  switch (taskType) {
    case TASK_TYPE.CRITICAL_ANALYSIS:
    case TASK_TYPE.SITUATIONAL_JUDGEMENT:
      availableStatuses = [
        TASK_STATUS.TEST_INITIALISED,
        TASK_STATUS.TEST_ACTIVATED,
        TASK_STATUS.FINALISED,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.QUALIFYING_TEST:
      availableStatuses = [
        TASK_STATUS.FINALISED,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.SCENARIO:
    case TASK_TYPE.EMP_TIEBREAKER:
      availableStatuses = [
        TASK_STATUS.TEST_INITIALISED,
        TASK_STATUS.TEST_ACTIVATED,
        // TASK_STATUS.PANELS_INITIALISED,
        // TASK_STATUS.PANELS_ACTIVATED,
        TASK_STATUS.DATA_ACTIVATED,
        TASK_STATUS.FINALISED,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.TELEPHONE_ASSESSMENT:
    case TASK_TYPE.ELIGIBILITY_SCC:
    case TASK_TYPE.STATUTORY_CONSULTATION:
    case TASK_TYPE.CHARACTER_AND_SELECTION_SCC:
        availableStatuses = [
        TASK_STATUS.STATUS_CHANGES,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.PRE_SELECTION_DAY_QUESTIONNAIRE:
      availableStatuses = [
        TASK_STATUS.CANDIDATE_FORM_CONFIGURE,
        TASK_STATUS.CANDIDATE_FORM_MONITOR,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.SIFT:
    case TASK_TYPE.SELECTION_DAY:
      availableStatuses = [
        TASK_STATUS.DATA_INITIALISED,
        TASK_STATUS.DATA_ACTIVATED,
        // TASK_STATUS.PANELS_INITIALISED,
        // TASK_STATUS.PANELS_ACTIVATED,
        TASK_STATUS.FINALISED,
        TASK_STATUS.COMPLETED,
      ];
      break;
    case TASK_TYPE.SHORTLISTING_OUTCOME:
    case TASK_TYPE.SELECTION_OUTCOME:
      availableStatuses = [
        TASK_STATUS.STAGE_OUTCOME,
        TASK_STATUS.COMPLETED,
      ];
      break;
  }
  return availableStatuses;
}

const MERIT_LIST_TASK_TYPES = [
  TASK_TYPE.CRITICAL_ANALYSIS,
  TASK_TYPE.SITUATIONAL_JUDGEMENT,
  TASK_TYPE.QUALIFYING_TEST,
  TASK_TYPE.SCENARIO,
  TASK_TYPE.SIFT,
  TASK_TYPE.SELECTION_DAY,
];
function getMeritListTaskTypes(exercise) {
  // if we have Qualifying Test then remove SJ & CA
  let taskTypes = getTaskTypes(exercise);
  if (taskTypes.indexOf(TASK_TYPE.QUALIFYING_TEST) >= 0) {
    taskTypes = taskTypes.filter(taskType => [TASK_TYPE.CRITICAL_ANALYSIS, TASK_TYPE.SITUATIONAL_JUDGEMENT].indexOf(taskType) < 0);
  }
  return taskTypes.filter(taskType => MERIT_LIST_TASK_TYPES.indexOf(taskType) >= 0);
}

function previousTaskType(exercise, type) {
  let prevTaskType = '';
  if (!exercise) return prevTaskType;
  if (type === TASK_TYPE.EMP_TIEBREAKER) return prevTaskType;  // TODO: remove this eventually: no previous task for EMP tie-breakers
  const taskTypes = getTaskTypes(exercise);
  const currentIndex = taskTypes.indexOf(type);
  if (currentIndex > 0) {
    if ([TASK_TYPE.CRITICAL_ANALYSIS, TASK_TYPE.SITUATIONAL_JUDGEMENT, TASK_TYPE.QUALIFYING_TEST].indexOf(type) >= 0) {
      for (let i = currentIndex; i >= 0; --i) {
        if ([TASK_TYPE.CRITICAL_ANALYSIS, TASK_TYPE.SITUATIONAL_JUDGEMENT, TASK_TYPE.QUALIFYING_TEST].indexOf(taskTypes[i]) < 0) {
          prevTaskType = taskTypes[i];
          break;
        }
      }
    } else {
      prevTaskType = taskTypes[currentIndex - 1];
    }
  }
  return prevTaskType;
}

function taskEntryStatus(exercise, type) {
  let status = '';
  if (!exercise) return status;
  if (type === TASK_TYPE.EMP_TIEBREAKER) return APPLICATION_STATUS.SCC_TO_RECONSIDER;  // TODO: remove this eventually: override entry status for EMP tie-breakers
  const prevTaskType = previousTaskType(exercise, type);
  if (prevTaskType) {
    status = `${prevTaskType}Passed`;
  }
  return status;
}

// merit list helpers
function emptyScoreSheet({ type, selectedCapabilities }) {
  let capabilities = CAPABILITIES;
  if (selectedCapabilities) {
    capabilities = CAPABILITIES.filter(cap => selectedCapabilities.indexOf(cap) >= 0);
  }
  // TODO ensure this is specific to exercise
  const fullScoreSheet = {
    sift: {
      scoreSheet: capabilities.reduce((acc, curr) => (acc[curr] = '', acc), {}),
    },
    selection: {
      scoreSheet: {
        leadership: capabilities.reduce((acc, curr) => (acc[curr] = '', acc), {}),
        roleplay: capabilities.reduce((acc, curr) => (acc[curr] = '', acc), {}),
        interview: capabilities.reduce((acc, curr) => (acc[curr] = '', acc), {}),
        overall: capabilities.reduce((acc, curr) => (acc[curr] = '', acc), {}),
      },
    },
  };
  return type ? fullScoreSheet[type] : fullScoreSheet;
}

// application helpers
function applicationCurrentStep(exercise, application) {
  if (!application._processing) { return null; }
  let currentStep;
  if (exercise._processingVersion >= 2) {
    switch (application._processing.stage) {
      case EXERCISE_STAGE.SHORTLISTING:
        if (hasQualifyingTests(exercise)) {
          if (hasScenarioTest(exercise)) {
            if (application._processing.status === APPLICATION_STATUS.SCENARIO_TEST_PASSED) {
              currentStep = 'passedTests';
            }
          } else {
            if (application._processing.status === APPLICATION_STATUS.QUALIFYING_TEST_PASSED) {
              currentStep = 'passedTests';
            }
          }
        }
        break;
      case EXERCISE_STAGE.SELECTION:
      case EXERCISE_STAGE.SCC:
      case EXERCISE_STAGE.RECOMMENDATION:
        currentStep = application._processing.stage;
        break;
      default:
        currentStep = null;
    }
  } else {
    switch (application._processing.stage) {
      case 'review':
        if (hasQualifyingTests(exercise)) {
          if (hasScenarioTest(exercise)) {
            if (application._processing.status === APPLICATION_STATUS.PASSED_SCENARIO_TEST) {
              currentStep = 'passedTests';
            }
          } else {
            if (application._processing.status === APPLICATION_STATUS.PASSED_FIRST_TEST) {
              currentStep = 'passedTests';
            }
          }
        }
        break;
      case 'shortlisted':
      case 'selected':
      case 'recommended':
        currentStep = application._processing.stage;
        break;
      default:
        currentStep = null;
    }
  }
  return currentStep;
}

// exercise helpers
function isReadyForApproval(data) {
  if (data === null) return false;
  return data.state === 'ready';
}
function isReadyForApprovalFromAdvertType(data) {
  if (data === null) return false;
  return (!data.advertType || [ADVERT_TYPES.FULL, ADVERT_TYPES.EXTERNAL, ADVERT_TYPES.LISTING].includes(data.advertType));
}
function isApprovalRejected(data) {
  if (data === null) return false;
  return ['draft', 'ready'].includes(data.state) && data._approval && data._approval.status === 'rejected';
}
function isEditable(data) {
  if (data === null) return false;
  switch (data.state) {
    case 'draft':
      return true;
    case 'ready':
    default:
      return false;
  }
}
function isArchived(data) {
  if (!data) return false;
  switch (data.state) {
    case 'archived':
      return true;
    default:
      return false;
  }
}
function isPublished(data) {
  if (!data) return false;
  return data.published;
}
function isApproved(data) {
  if (!data) return false;
  switch (data.state) {
    case 'draft':
    case 'ready':
      return false;
    default:
      return true;
  }
}
function isProcessing(exercise) {
  if (!exercise) { return false; }
  return exercise._applicationRecords ? true : false;
}
function isClosed(exercise) {
  if (!exercise) { return false; }
  return isApproved && exercise.applicationCloseDate && exercise.applicationCloseDate <= new Date();
}
function applicationCounts(exercise) {
  return exercise && exercise._applications ? exercise._applications : {};
}
function applicationRecordCounts(exercise) {
  return isProcessing(exercise) ? exercise._applicationRecords : {};
}
function exerciseStates(exercise) {
  if (!exercise) { return []; }
  const states = [];
  states.push('shortlisting');
  states.push('selection');
  states.push('recommendation');
  states.push('recommended');
  states.push('handover');
  return states;
}
function exerciseAdvertTypes(exercise) {
  if (!exercise) { return []; }
  const advertTypes = [];

  Object.keys(ADVERT_TYPES).map(item => {
    advertTypes.push(ADVERT_TYPES[item]);
  });
  return advertTypes;
}
function applicationContentSteps(data) {
  if (!data) { return []; }
  const exercise = data;
  const steps = [];
  if (exercise._processingVersion >= 2) {
    if (hasQualifyingTests(data)) {
      steps.push('passedTests');
    }
    steps.push(EXERCISE_STAGE.SELECTION);
    steps.push(EXERCISE_STAGE.SCC);
    steps.push(EXERCISE_STAGE.RECOMMENDATION);
  } else {
    if (hasQualifyingTests(data)) {
      steps.push('passedTests');
    }
    steps.push(EXERCISE_STAGE.SHORTLISTED);
    steps.push(EXERCISE_STAGE.SELECTED);
    steps.push(EXERCISE_STAGE.RECOMMENDED);
  }
  return steps;
}
function configuredApplicationContentSteps(exercise) {
  if (!exercise) { return []; }
  if (!exercise._applicationContent) { return []; }
  return applicationContentSteps(exercise)
    .filter(step => {
      if (exercise._applicationContent[step]) {
        return Object.values(exercise._applicationContent[step]).filter(value => value === true).length;
      }
      return false;
    });
}
function hasIndependentAssessments(data) {
  return !(data.assessmentMethods && data.assessmentMethods.independentAssessments === false);
}
function hasLeadershipJudgeAssessment(data) {
  return data.assessmentMethods && data.assessmentMethods.leadershipJudgeAssessment;
}
function hasQualifyingTests(data) {
  if (!data.shortlistingMethods || data.shortlistingMethods.length === 0) return false;
  if (data.shortlistingMethods.indexOf('situational-judgement-qualifying-test') >= 0) return true;
  if (data.shortlistingMethods.indexOf('critical-analysis-qualifying-test') >= 0) return true;
  if (data.shortlistingMethods.indexOf('scenario-test-qualifying-test') >= 0) return true;
  return false;
}
function hasScenarioTest(data) {
  if (!data.shortlistingMethods || data.shortlistingMethods.length === 0) return false;
  if (data.shortlistingMethods.indexOf('scenario-test-qualifying-test') >= 0) return true;
  return false;
}
function hasRelevantMemberships(data) {
  if (isNonLegal(data)) {
    if (data.memberships && data.memberships.length) {
      if (data.memberships.indexOf('none') === -1) {
        return true;
      }
    }
  }
  return false;
}
function hasStatementOfSuitability(data) {
  return data.assessmentMethods && (
    data.assessmentMethods[ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_COMPETENCIES] ||
    data.assessmentMethods[ASSESSMENT_METHOD.STATEMENT_OF_SUITABILITY_WITH_SKILLS_AND_ABILITIES]
  );
}
function hasCoveringLetter(data) {
  return data.assessmentMethods && data.assessmentMethods[ASSESSMENT_METHOD.COVERING_LETTER];
}
function hasCV(data) {
  return data.assessmentMethods && data.assessmentMethods[ASSESSMENT_METHOD.CV];
}
function hasStatementOfEligibility(data) {
  return data.assessmentMethods && data.assessmentMethods[ASSESSMENT_METHOD.STATEMENT_OF_ELIGIBILITY] && !!(data.aSCApply && data.selectionCriteria && data.selectionCriteria.length);
}
function hasSelfAssessment(data) {
  return data.assessmentMethods && data.assessmentMethods[ASSESSMENT_METHOD.SELF_ASSESSMENT_WITH_COMPETENCIES];
}

function isLegal(data) {
  return data.typeOfExercise === 'legal' || data.typeOfExercise === 'leadership';
}
function isNonLegal(data) {
  return data.typeOfExercise === 'non-legal' || data.typeOfExercise === 'leadership-non-legal';
}
function isTribunal(data) {
  return data.isCourtOrTribunal === 'tribunal';
}
function isWelshAdministrationRequired(exercise) {
  return exercise.welshRequirementType.includes('welsh-administration-questions');
}
function isSpeakWelshRequired(exercise) {
  return exercise.welshRequirementType.includes('welsh-speaking');
}
function isReadWriteWelshRequired(exercise) {
  return exercise.welshRequirementType.includes('welsh-reading-writing');
}
function isApplyingForWelshPost(exercise, application) {
  return exercise.welshRequirement && application.applyingForWelshPost;
}
function currentState(data) { // default to registration
  if (data._applicationContent && data._applicationContent._currentStep) {
    if (APPLICATION_STEPS.indexOf(data._applicationContent._currentStep.step) >= 0) {
      return data._applicationContent._currentStep.step;
    }
  }
  return 'registration';
}
function applicationContentList(data) {  // returns applicationContent map as an array
  const applicationContentList = [];
  if (data && data._applicationContent) {
    const steps = ['registration'].concat(applicationContentSteps(data));
    steps.forEach(step => {
      if (data._applicationContent[step]) {
        const selectedParts = [];
        APPLICATION_PARTS.forEach(part => {
          if (data._applicationContent[step][part]) {
            selectedParts.push(part);
          }
        });
        applicationContentList.push({
          ref: step,
          parts: selectedParts,
        });
      } else {
        applicationContentList.push({
          ref: step,
          parts: [],
        });
      }
    });
  }
  return applicationContentList;
}

function exerciseApplicationParts(data, newValues) {
  const exercise = clone(data);
  if (newValues) {  // override exercise values with passed in data
    Object.keys(newValues).forEach(key => {
      exercise[key] = newValues[key];
    });
  }
  const applicationParts = [];
  applicationParts.push('personalDetails');
  applicationParts.push('characterInformation');
  applicationParts.push('equalityAndDiversitySurvey');
  if (exercise.isSPTWOffered) {
    applicationParts.push('partTimeWorkingPreferences');
  }
  if (exercise.locationQuestion || (exercise.locationPreferences && exercise.locationPreferences.length)) {
    applicationParts.push('locationPreferences');
  }
  if (exercise.jurisdictionQuestion || (exercise.jurisdictionPreferences && exercise.jurisdictionPreferences.length)) {
    applicationParts.push('jurisdictionPreferences');
  }
  if (exercise.additionalWorkingPreferences && exercise.additionalWorkingPreferences.length) {
    applicationParts.push('additionalWorkingPreferences');
  }
  if (exercise.welshRequirement) {
    applicationParts.push('welshPosts');
  }
  if (isLegal(exercise)) {
    applicationParts.push('relevantQualifications');
    applicationParts.push('postQualificationWorkExperience');

    if (isApplicationVersionLessThan(exercise, 3)) {
      if (exercise.previousJudicialExperienceApply) {
        applicationParts.push('judicialExperience');
      }
      applicationParts.push('employmentGaps');
    }

    applicationParts.push('reasonableLengthOfService');
  }
  if (isNonLegal(exercise)) {
    if (exercise.previousJudicialExperienceApply) {
      applicationParts.push('judicialExperience');
    }
    if (hasRelevantMemberships(exercise)) {
      applicationParts.push('relevantMemberships');
    }
    applicationParts.push('relevantExperience');
    applicationParts.push('employmentGaps');
    applicationParts.push('reasonableLengthOfService');
  }
  if (hasIndependentAssessments(exercise)) {
    applicationParts.push('assessorsDetails');
  }
  if (hasLeadershipJudgeAssessment(exercise)) {
    applicationParts.push('leadershipJudgeDetails');
  }
  if (hasStatementOfSuitability(exercise)) {
    applicationParts.push('statementOfSuitability');
  }
  if (hasCV(exercise)) {
    applicationParts.push('cv');
  }
  if (hasCoveringLetter(exercise)) {
    applicationParts.push('coveringLetter');
  }
  if (hasStatementOfEligibility(exercise)) {
    applicationParts.push('statementOfEligibility');
  }
  if (hasSelfAssessment(exercise)) {
    applicationParts.push('selfAssessmentCompetencies');
  }
  applicationParts.push('commissionerConflicts');
  applicationParts.push('additionalInfo');
  return applicationParts;
}

/**
 * getExerciseSaveData
 * Accepts an exercise and a data object
 * Return the data object seeded with `_applicationContent` property if it doesn't already exist in the data object
 * This means _applicationContent will always be updated / recalculated UNLESS it has been provided in the save data (in which case we use that)
 * Note: this code was copied from store/exercise/document.js as it is also used in views/Exercise/Details/ApplicationContent/Edit.vue
 */
function getExerciseSaveData(exercise, data) {
  // Creates the _applicationContent if it doesnt already exist
  const saveData = clone(data);
  if (JSON.stringify(saveData).indexOf('_applicationContent') === -1) {  // recalculate applicationContent (if necessary)
    const applicationParts = exerciseApplicationParts(exercise, data);
    const existingApplicationParts = configuredApplicationParts(exercise);
    const newApplicationParts = applicationParts.filter(part => existingApplicationParts.indexOf(part) === -1);
    if (newApplicationParts.length || existingApplicationParts.length !== applicationParts.length) {
      const applicationContentBefore = exercise._applicationContent ? exercise._applicationContent : {};
      const applicationContentAfter = {};
      APPLICATION_STEPS.forEach(step => {
        applicationContentAfter[step] = {};
        applicationParts.forEach(part => {
          if (applicationContentBefore[step] && (applicationContentBefore[step][part] === true || applicationContentBefore[step][part] === false)) {
            applicationContentAfter[step][part] = applicationContentBefore[step][part];
          } else if (step === 'registration' && newApplicationParts.indexOf(part) >= 0) {
            applicationContentAfter[step][part] = true;
          }
        });
      });
      if (applicationContentBefore._currentStep) {
        applicationContentAfter._currentStep = applicationContentBefore._currentStep;
      }
      saveData['_applicationContent'] = applicationContentAfter;
    }
  }
  return saveData;
}

function applicationPartsMap(data) {
  const applicationParts = exerciseApplicationParts(data);
  const applicationPartsMap = {};
  applicationParts.forEach(part => applicationPartsMap[part] = true);
  return applicationPartsMap;
}

function selectedApplicationParts(data) {
  let selectedParts = [];
  if (data && data._applicationContent) {
    Object.entries(data._applicationContent).forEach((keyValue) => {
      selectedParts = selectedParts.concat(Object.entries(keyValue[1]).filter((part) => part[1] === true).map(part => part[0]));
    });
  }
  return selectedParts;
}
function unselectedApplicationParts(data) {
  const availableParts = exerciseApplicationParts(data);
  const selectedParts = selectedApplicationParts(data);
  return availableParts.filter((el) => !selectedParts.includes(el));
}
function configuredApplicationParts(data) {
  let configuredParts = [];
  if (data && data._applicationContent) {
    Object.entries(data._applicationContent).forEach((keyValue) => {
      configuredParts = configuredParts.concat(Object.entries(keyValue[1]).map(part => part[0]).filter(part => configuredParts.indexOf(part) === -1));
    });
  }
  return configuredParts;
}

// application parts up to and including current stage
function applicationParts(data) {
  if (data._applicationContent) {
    const applicationContent = applicationContentList(data);
    const applicationParts = {};
    const state = currentState(data);
    let stateFound = false;
    for (let i = applicationContent.length - 1; i >= 0; --i) {
      if (stateFound || applicationContent[i].ref === state) {
        stateFound = true;
        applicationContent[i].parts.forEach(part => applicationParts[part] = true);
      }
    }
    return applicationParts;
  }
  return {};
}
// application parts in current stage (n.b. returns registration by default)
function currentApplicationParts(data) {
  if (data._applicationContent) {
    return data._applicationContent[currentState(data)];
  }
  return [];
}

// check if application part is asked in current stage
function isApplicationPartAsked(exercise, part) {
  let isAsked = false;
  if (hasApplicationProcess(exercise)) {
    const parts = applicationParts(exercise);
    for (const key in parts) {
      if (key === part && parts[key]) {
        isAsked = true;
      }
    }
  } else {
    isAsked = true;
  }
  return isAsked;
}

// check if character checks of application is sent
function isCharacterChecksAsked(application) {
  return application && application.characterChecks && application.characterChecks.status !== 'not requested';
}

// are there application parts in current stage (not registration)
function isMoreInformationNeeded(exercise, application) {
  if (exercise._applicationContent && exercise._applicationContent._currentStep && exercise._applicationContent._currentStep.step) {
    if (
      exercise._applicationContent._currentStep.step !== 'registration'
      && APPLICATION_STEPS.indexOf(exercise._applicationContent._currentStep.step) >= 0
      && Object.keys(currentApplicationParts(exercise)).length
      && exercise._applicationContent._currentStep.start <= new Date()
      && exercise._applicationContent._currentStep.end >= new Date()
      && applicationCurrentStep(exercise, application) === exercise._applicationContent._currentStep.step
    ) {
      return true;
    }
  }
  return false;
}
function isApplicationComplete(vacancy, application) {
  if (!(application && application.progress)) return false;
  const requiredParts = applicationParts(vacancy);
  if (!requiredParts) return false;
  const partsToComplete = Object.keys(requiredParts).filter(part => requiredParts[part] === true);
  const incompleteParts = partsToComplete.filter(part => application.progress[part] !== true);
  return incompleteParts.length === 0;
}

// does the exercise have an application process configured
function hasApplicationProcess(exercise) {
  if (!exercise) { return false; }
  const applicationSteps = configuredApplicationContentSteps(exercise);
  return applicationSteps.length >= 1;
}

function availableStages(exercise) {
  const stages = [];
  if (!exercise) return stages;
  if (exercise._processingVersion >= 2) {
    stages.push(EXERCISE_STAGE.SHORTLISTING);
    stages.push(EXERCISE_STAGE.SELECTION);
    stages.push(EXERCISE_STAGE.SCC);
    stages.push(EXERCISE_STAGE.RECOMMENDATION);
  } else {
    stages.push(EXERCISE_STAGE.REVIEW);
    stages.push(EXERCISE_STAGE.SHORTLISTED);
    stages.push(EXERCISE_STAGE.SELECTED);
    stages.push(EXERCISE_STAGE.RECOMMENDED);
    stages.push(EXERCISE_STAGE.HANDOVER);
  }
  return stages;
}

function getPreviousStage(exercise, currentStage) {
  if (exercise._processingVersion >= 2) {
    switch (currentStage) {
    case EXERCISE_STAGE.SHORTLISTING:
      return '';
    case EXERCISE_STAGE.SELECTION:
      return EXERCISE_STAGE.SHORTLISTING;
    case EXERCISE_STAGE.SCC:
      return EXERCISE_STAGE.SELECTION;
    case EXERCISE_STAGE.RECOMMENDATION:
      return EXERCISE_STAGE.SCC;
    }
  } else {
    switch (currentStage) {
    case EXERCISE_STAGE.REVIEW:
      return '';
    case EXERCISE_STAGE.SHORTLISTED:
      return EXERCISE_STAGE.REVIEW;
    case EXERCISE_STAGE.SELECTED:
      return EXERCISE_STAGE.SHORTLISTED;
    case EXERCISE_STAGE.RECOMMENDED:
      return EXERCISE_STAGE.SELECTED;
    case EXERCISE_STAGE.HANDOVER:
      return EXERCISE_STAGE.RECOMMENDED;
    }
  }
}

function getNextStage(exercise, currentStage, newStatus) {
  if (newStatus) {
    const moveBackStatuses = getStageMoveBackStatuses(exercise, currentStage);
    if (moveBackStatuses.indexOf(newStatus) >= 0) {
      const stages = availableStages(exercise);
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex > 0) {
        return stages[currentIndex - 1];
      }
    }
    const passingStatuses = getStagePassingStatuses(exercise, currentStage);
    if (passingStatuses.indexOf(newStatus) >= 0) {
      if (exercise._processingVersion >= 2) {
        switch (currentStage) {
        case EXERCISE_STAGE.SHORTLISTING:
          return EXERCISE_STAGE.SELECTION;
        case EXERCISE_STAGE.SELECTION:
          return EXERCISE_STAGE.SCC;
        case EXERCISE_STAGE.SCC:
          return EXERCISE_STAGE.RECOMMENDATION;
        }
      } else {
        switch (currentStage) {
        case EXERCISE_STAGE.REVIEW:
          return EXERCISE_STAGE.SHORTLISTED;
        case EXERCISE_STAGE.SHORTLISTED:
          return EXERCISE_STAGE.SELECTED;
        case EXERCISE_STAGE.SELECTED:
          return EXERCISE_STAGE.RECOMMENDED;
        case EXERCISE_STAGE.RECOMMENDED:
          return EXERCISE_STAGE.HANDOVER;
        }
      }
    }
  } else {
    const stages = availableStages(exercise);
    const currentStageIndex = stages.indexOf(currentStage);
    if (currentStageIndex >= 0 && currentStageIndex < stages.length - 1) {
      return stages[currentStageIndex + 1];
    }
  }
  return currentStage;
}

// returns an array of statuses which trigger a move to the next stage
function getStagePassingStatuses(exercise, stage) {
  if (exercise._processingVersion >= 2) {
    switch (stage) {
    case EXERCISE_STAGE.SHORTLISTING:
      return [APPLICATION_STATUS.SHORTLISTING_PASSED];
    case EXERCISE_STAGE.SELECTION:
      return [APPLICATION_STATUS.PASSED_RECOMMENDED];
    case EXERCISE_STAGE.SCC:
      return [APPLICATION_STATUS.RECOMMENDED_IMMEDIATE, APPLICATION_STATUS.RECOMMENDED_FUTURE, APPLICATION_STATUS.SECOND_STAGE_PASSED];
    case EXERCISE_STAGE.RECOMMENDATION:
      return [];
    }
  } else {
    switch (stage) {
    case EXERCISE_STAGE.REVIEW:
      return '';
    case EXERCISE_STAGE.SHORTLISTED:
      return [APPLICATION_STATUS.INVITED_TO_SELECTION_DAY];
    case EXERCISE_STAGE.SELECTED:
      return [APPLICATION_STATUS.PASSED_SELECTION];
    case EXERCISE_STAGE.RECOMMENDED:
      return [APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT, APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT];
    }
  }
}

function getStageMoveBackStatuses(exercise, stage) {
  if (exercise._processingVersion >= 2) {
    switch (stage) {
    case EXERCISE_STAGE.RECOMMENDATION:
      return [APPLICATION_STATUS.RECONSIDER];
    }
  }
  return [];
}

function getStageWithdrawalStatus(exercise) {
  if (exercise._processingVersion >= 2) {
    return APPLICATION_STATUS.WITHDRAWN;
  } else {
    return APPLICATION_STATUS.WITHDREW_APPLICATION;
  }
}

function availableStatuses(exercise, stage) {
  let statuses = [];
  if (exercise._processingVersion >= 2) {
    switch (stage) {
    case EXERCISE_STAGE.SHORTLISTING:
      statuses = [
        ...shortlistingStatuses(exercise),
        APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
        APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
        APPLICATION_STATUS.FULL_APPLICATION_NOT_SUBMITTED,
        APPLICATION_STATUS.WITHDRAWN,
        APPLICATION_STATUS.SHORTLISTING_PASSED,
        // APPLICATION_STATUS.SHORTLISTING_FAILED,
      ];
      return statuses;
    case EXERCISE_STAGE.SELECTION:
      statuses = [
        APPLICATION_STATUS.SELECTION_DAY_PASSED,
        APPLICATION_STATUS.SELECTION_DAY_FAILED,
        APPLICATION_STATUS.PASSED_RECOMMENDED,
        APPLICATION_STATUS.WITHDRAWN,
      ];
      return statuses;
    case EXERCISE_STAGE.SCC:
      statuses = [
        APPLICATION_STATUS.REJECTED_CHARACTER,
        APPLICATION_STATUS.REJECTED_MERIT,
        APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
        APPLICATION_STATUS.RECOMMENDED_FUTURE,
        APPLICATION_STATUS.SECOND_STAGE_INVITED,
        APPLICATION_STATUS.SECOND_STAGE_PASSED,
        APPLICATION_STATUS.SECOND_STAGE_FAILED,
        APPLICATION_STATUS.WITHDRAWN,
      ];
      return statuses;
    case EXERCISE_STAGE.RECOMMENDATION:
      statuses = [
        APPLICATION_STATUS.APPROVED_IMMEDIATE,
        APPLICATION_STATUS.APPROVED_FUTURE,
        APPLICATION_STATUS.RECONSIDER,
      ];
      return statuses;
    default:
      statuses = [  // TODO make this specific to exercise
        ...shortlistingStatuses(exercise),
        APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
        APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
        APPLICATION_STATUS.FULL_APPLICATION_NOT_SUBMITTED,
        APPLICATION_STATUS.SHORTLISTING_PASSED,
        APPLICATION_STATUS.SHORTLISTING_FAILED,
        APPLICATION_STATUS.SELECTION_DAY_PASSED,
        APPLICATION_STATUS.SELECTION_DAY_FAILED,
        APPLICATION_STATUS.PASSED_RECOMMENDED,
        APPLICATION_STATUS.REJECTED_CHARACTER,
        APPLICATION_STATUS.REJECTED_MERIT,
        APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
        APPLICATION_STATUS.RECOMMENDED_FUTURE,
        APPLICATION_STATUS.SECOND_STAGE_INVITED,
        APPLICATION_STATUS.SECOND_STAGE_PASSED,
        APPLICATION_STATUS.SECOND_STAGE_FAILED,
        APPLICATION_STATUS.APPROVED_IMMEDIATE,
        APPLICATION_STATUS.APPROVED_FUTURE,
        APPLICATION_STATUS.RECONSIDER,
        APPLICATION_STATUS.WITHDRAWN,
      ];
      return statuses;
    }
  } else {
    switch (stage) {
    case EXERCISE_STAGE.REVIEW:
      statuses = [
        ...shortlistingStatuses(exercise),
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    case EXERCISE_STAGE.SHORTLISTED:
      statuses = [
        APPLICATION_STATUS.INVITED_TO_SELECTION_DAY,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    case EXERCISE_STAGE.SELECTED:
      statuses = [
        APPLICATION_STATUS.PASSED_SELECTION,
        APPLICATION_STATUS.FAILED_SELECTION,
        APPLICATION_STATUS.PASSED_BUT_NOT_RECOMMENDED,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    case EXERCISE_STAGE.RECOMMENDED:
      statuses = [
        APPLICATION_STATUS.REJECTED_BY_CHARACTER,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
        APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
        APPLICATION_STATUS.SCC_TO_RECONSIDER,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    case EXERCISE_STAGE.HANDOVER:
      statuses = [
        APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
        APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    default:
      statuses = [  // TODO make this specific to exercise
        ...shortlistingStatuses(exercise),
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
        APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
        APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
      return statuses;
    }
  }
}

function availableReportLinks(exercise) {
  const path = `/exercise/${exercise.id}/reports`;
  const links = [
    {
      title: 'Diversity',
      name: 'exercise-reports-diversity',
    },
    {
      title: 'Merit List',
      name: 'merit-list',
    },
    {
      title: 'Outreach',
      name: 'outreach',
    },
    {
      title: 'Character Annex',
      name: 'character-issues',
    },
    {
      title: 'Eligibility Annex',
      name: 'eligibility-issues',
    },
    {
      title: 'Reasonable Adjustments',
      name: 'reasonable-adjustments',
    },
    {
      title: 'Agency',
      name: 'agency',
    },
    {
      title: 'Handover',
      name: 'handover',
    },
    {
      title: 'Deployment',
      name: 'deployment',
    },
    {
      title: 'Statutory Consultation',
      name: 'statutory-consultation',
    },
    {
      title: 'Custom',
      name: 'custom',
    },
  ];

  if (exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
    if (
      (exercise.shortlistingMethods.indexOf('paper-sift') >= 0 && exercise.siftStartDate)
      || (exercise.shortlistingMethods.indexOf('name-blind-paper-sift') >= 0 && exercise.nameBlindSiftStartDate)
    ) {
      links.push(
        {
          title: 'Sift',
          path: `${path}/sift`,
        }
      );
    }
  }
  if (exercise.scenarioTestDate) {  // TODO: remove this when we have better support for scenarios
    links.push(
      {
        title: 'Scenario Responses',
        path: `${path}/scenario`,
      }
    );
  }
  if (exercise.selectionDays) {
    links.push(
      {
        title: 'Selection day',
        path: `${path}/selection`,
      }
    );
  }
  if (exercise?._applicationContent?.registration?.commissionerConflicts) {
    links.push(
      {
        title: 'Commissioner conflicts',
        path: `${path}/commissioner-conflicts`,
      }
    );
  }

  links.sort((a, b) => a.title.localeCompare(b.title));
  return links;
}

function shortlistingStatuses(exercise) {
  const statuses = [];
  if (exercise && exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
    // QT
    if (
      (
        exercise.shortlistingMethods.indexOf(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST) >= 0 ||
        exercise.shortlistingMethods.indexOf(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST) >= 0
      )
    ) {
      if (exercise._processingVersion >= 2) {
        statuses.push(APPLICATION_STATUS.QUALIFYING_TEST_PASSED);
        statuses.push(APPLICATION_STATUS.QUALIFYING_TEST_FAILED);
        statuses.push(APPLICATION_STATUS.QUALIFYING_TEST_NOT_SUBMITTED);
      } else {
        statuses.push(APPLICATION_STATUS.SUBMITTED_FIRST_TEST);
        statuses.push(APPLICATION_STATUS.FAILED_FIRST_TEST);
        statuses.push(APPLICATION_STATUS.PASSED_FIRST_TEST);
        statuses.push(APPLICATION_STATUS.NO_TEST_SUBMITTED);
        statuses.push(APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME);
      }
    }
    // scenario test
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST) >= 0) {
      if (exercise._processingVersion >= 2) {
        statuses.push(APPLICATION_STATUS.SCENARIO_TEST_PASSED);
        statuses.push(APPLICATION_STATUS.SCENARIO_TEST_FAILED);
        statuses.push(APPLICATION_STATUS.SCENARIO_TEST_NOT_SUBMITTED);
      } else {
        statuses.push(APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST);
        statuses.push(APPLICATION_STATUS.FAILED_SCENARIO_TEST);
        statuses.push(APPLICATION_STATUS.PASSED_SCENARIO_TEST);
      }
    }
    // sift
    if (
      exercise.shortlistingMethods.indexOf(SHORTLISTING.NAME_BLIND_PAPER_SIFT) >= 0 ||
      exercise.shortlistingMethods.indexOf(SHORTLISTING.PAPER_SIFT) >= 0
    ) {
      if (exercise._processingVersion >= 2) {
        statuses.push(APPLICATION_STATUS.SIFT_PASSED);
        statuses.push(APPLICATION_STATUS.SIFT_FAILED);
      } else {
        statuses.push(APPLICATION_STATUS.PASSED_SIFT);
        statuses.push(APPLICATION_STATUS.FAILED_SIFT);
      }
    }
    // telephone assessment
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.TELEPHONE_ASSESSMENT) >= 0) {
      if (exercise._processingVersion >= 2) {
        statuses.push(APPLICATION_STATUS.TELEPHONE_ASSESSMENT_PASSED);
        statuses.push(APPLICATION_STATUS.TELEPHONE_ASSESSMENT_FAILED);
      } else {
        statuses.push(APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT);
        statuses.push(APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT);
      }
    }
    // other
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.OTHER) >= 0) {
      statuses.push(APPLICATION_STATUS.OTHER_PASSED);
      statuses.push(APPLICATION_STATUS.OTHER_FAILED);
    }
  }
  return statuses;
}

function isApplicationVersionGreaterThan(exercise, version) {
  return exercise?._applicationVersion > version;
}
function isApplicationVersionLessThan(exercise, version) {
  return exercise?._applicationVersion < version;
}

function isJAC00187(env, referenceNumber) {
  if (!env || !referenceNumber) { return false; }
  return (env === 'DEVELOP' && referenceNumber === 'JAC00696') ||
    (env === 'STAGING' && referenceNumber === 'JAC00695') ||
    (env === 'PRODUCTION' && referenceNumber === 'JAC00187');
}
