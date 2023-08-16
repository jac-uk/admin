/*eslint func-style: ["error", "declaration"]*/
import clone from 'clone';
import { ADVERT_TYPES, EXERCISE_STAGE, APPLICATION_STATUS, SHORTLISTING, TASK_TYPE, ASSESSMENT_METHOD } from '@/helpers/constants';
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
  getTimelineTasks,
  getTaskTypes,
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
  getPreviousStage,
  getNextStage
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
const APPLICATION_STEPS = ['registration', 'passedTests', 'shortlisted', 'selected', 'recommended'];
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
];

const CAPABILITIES = ['L&J', 'PQ', 'L', 'EJ', 'PBK', 'ACI', 'WCO', 'MWE', 'OVERALL'];
const SELECTION_CATEGORIES = ['leadership', 'roleplay', 'situational', 'interview', 'overall'];

const STAGE_TASKS = {
  shortlisting: [
    TASK_TYPE.CRITICAL_ANALYSIS,
    TASK_TYPE.SITUATIONAL_JUDGEMENT,
    TASK_TYPE.SCENARIO,
    TASK_TYPE.TELEPHONE_ASSESSMENT,
    TASK_TYPE.SIFT,
    TASK_TYPE.ELIGIBILITY_SCC,
    TASK_TYPE.SHORTLISTING_OUTCOME,
  ],
  selection: [
    TASK_TYPE.SELECTION,
    TASK_TYPE.STATUTORY_CONSULTATION,
    TASK_TYPE.CHARACTER_AND_SELECTION_SCC,
    TASK_TYPE.SELECTION_OUTCOME,
  ],
};

const TASK_STATUS = {
  DATA_INITIALISED: 'dataInitialised',
  DATA_ACTIVATED: 'dataActivated',
  TEST_INITIALISED: 'testInitialised',
  TEST_ACTIVATED: 'testActivated',
  PANELS_INITIALISED: 'panelsInitialised',
  PANELS_ACTIVATED: 'panelsActivated',
  MODERATION_INITIALISED: 'moderationInitialised',
  MODERATION_ACTIVATED: 'moderationActivated',
  STATUS_CHANGES: 'statusChanges',
  FINALISED: 'finalised',
  CHECKS: 'checks',
  COMPLETED: 'completed',
};

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
  const timelineTasks = timeline.filter(item => item.taskType && (!taskType || item.taskType === taskType));
  return timelineTasks;
}

function getTaskTypes(exercise, stage) {
  let taskTypes = getTimelineTasks(exercise).map(item => item.taskType).filter((value, index, thisArray) => thisArray.indexOf(value) === index);
  if (stage) {
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
  if (type === TASK_TYPE.EMP_TIEBREAKER) return APPLICATION_STATUS.SECOND_STAGE_INVITED;  // TODO: remove this eventually: override entry status for EMP tie-breakers
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
  switch (application._processing.stage) {
    case 'review':
      if (hasQualifyingTests(exercise)) {
        if (hasScenarioTest(exercise)) {
          if (application._processing.status === 'passedScenarioTest') {
            currentStep = 'passedTests';
          }
        } else {
          if (application._processing.status === 'passedFirstTest') {
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
  return currentStep;
}

// exercise helpers
function isReadyForApproval(data) {
  if (data === null) return false;
  return data.state === 'ready';
}
function isReadyForApprovalFromAdvertType(data) {
  if (data === null) return false;
  return (!data.advertType || data.advertType === ADVERT_TYPES.FULL || data.advertType === ADVERT_TYPES.EXTERNAL);
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
  const steps = [];
  if (hasQualifyingTests(data)) {
    steps.push('passedTests');
  }
  steps.push('shortlisted');
  steps.push('selected');
  steps.push('recommended');
  return steps;
}
function configuredApplicationContentSteps(exercise) {
  if (!exercise) { return []; }
  if (!exercise._applicationContent) { return []; }
  return applicationContentSteps(exercise)
    .filter(step => Object.values(exercise._applicationContent[step]).filter(value => value === true).length);
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
  if (exercise.locationQuestion) {
    applicationParts.push('locationPreferences');
  }
  if (exercise.jurisdictionQuestion) {
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
    if (exercise.previousJudicialExperienceApply) {
      applicationParts.push('judicialExperience');
    }
    applicationParts.push('employmentGaps');
    applicationParts.push('reasonableLengthOfService');
  }
  if (isNonLegal(exercise)) {
    applicationParts.push('relevantQualifications');
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

  console.log('isApplicationPartAsked', part, isAsked);
  return isAsked;
}

// check if character checks of application is sent
function isCharacterChecksAsked(application) {
  return application && application.characterChecks.status !== 'not requested';
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
  stages.push(EXERCISE_STAGE.APPLIED);
  stages.push(EXERCISE_STAGE.SHORTLISTED);
  stages.push(EXERCISE_STAGE.SELECTABLE);
  stages.push(EXERCISE_STAGE.RECOMMENDED);
  stages.push(EXERCISE_STAGE.HANDOVER);
  return stages;
}

function getPreviousStage(exercise, currentStage) {
  switch (currentStage) {
  case EXERCISE_STAGE.APPLIED:
    return '';
  case EXERCISE_STAGE.SHORTLISTED:
    return EXERCISE_STAGE.APPLIED;
  case EXERCISE_STAGE.SELECTABLE:
    return EXERCISE_STAGE.SHORTLISTED;
  case EXERCISE_STAGE.RECOMMENDED:
    return EXERCISE_STAGE.SELECTABLE;
  case EXERCISE_STAGE.HANDOVER:
    return EXERCISE_STAGE.RECOMMENDED;
  }
}

function getNextStage(exercise, currentStage, newStatus) {
  switch (currentStage) {
  case EXERCISE_STAGE.APPLIED:  // TODO make this specific to exercise
    if (newStatus === APPLICATION_STATUS.SIFT_PASSED) return EXERCISE_STAGE.SHORTLISTED;
    break;
  case EXERCISE_STAGE.SHORTLISTED:
    if (newStatus === APPLICATION_STATUS.SELECTION_PASSED) return EXERCISE_STAGE.SELECTABLE;
    break;
  case EXERCISE_STAGE.SELECTABLE:
    if (newStatus === APPLICATION_STATUS.PASSED_RECOMMENDED) return EXERCISE_STAGE.RECOMMENDED;
    break;
  case EXERCISE_STAGE.RECOMMENDED:
    if (newStatus === APPLICATION_STATUS.RECOMMENDED_IMMEDIATE) return EXERCISE_STAGE.HANDOVER;
    if (newStatus === APPLICATION_STATUS.RECOMMENDED_FUTURE) return EXERCISE_STAGE.HANDOVER;
    break;
  }
  return currentStage;
}

function availableStatuses(exercise, stage) {
  let statuses = [];
  switch (stage) {
  case EXERCISE_STAGE.APPLIED:
    statuses = [
      ...shortlistingStatuses(exercise),
      // APPLICATION_STATUS.SELECTION_INVITED,
      APPLICATION_STATUS.ELIGIBILITY_SCC_PASSED,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.REJECTED_CHARACTER,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  case EXERCISE_STAGE.SHORTLISTED:
    statuses = [
      APPLICATION_STATUS.SELECTION_PASSED,
      APPLICATION_STATUS.SELECTION_FAILED,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  case EXERCISE_STAGE.SELECTABLE:
    statuses = [
      APPLICATION_STATUS.PASSED_RECOMMENDED,
      APPLICATION_STATUS.PASSED_NOT_RECOMMENDED,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  case EXERCISE_STAGE.RECOMMENDED:
    statuses = [
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.REJECTED_CHARACTER,
      APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
      APPLICATION_STATUS.RECOMMENDED_FUTURE,
      APPLICATION_STATUS.RECONSIDER,
      APPLICATION_STATUS.SECOND_STAGE_INVITED,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  case EXERCISE_STAGE.HANDOVER:
    statuses = [
      APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
      APPLICATION_STATUS.RECOMMENDED_FUTURE,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  default:
    statuses = [  // TODO make this specific to exercise
      ...shortlistingStatuses(exercise),
      APPLICATION_STATUS.SELECTION_INVITED,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_STATUTORY,
      APPLICATION_STATUS.REJECTED_INELIGIBLE_ADDITIONAL,
      APPLICATION_STATUS.REJECTED_CHARACTER,
      APPLICATION_STATUS.SELECTION_PASSED,
      APPLICATION_STATUS.SELECTION_FAILED,
      APPLICATION_STATUS.PASSED_RECOMMENDED,
      APPLICATION_STATUS.PASSED_NOT_RECOMMENDED,
      APPLICATION_STATUS.RECOMMENDED_IMMEDIATE,
      APPLICATION_STATUS.RECOMMENDED_FUTURE,
      APPLICATION_STATUS.RECONSIDER,
      APPLICATION_STATUS.SECOND_STAGE_INVITED,
      APPLICATION_STATUS.WITHDRAWN,
    ];
    return statuses;
  }
}

function shortlistingStatuses(exercise) {
  const statuses = [];
  if (exercise && exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST) >= 0) {
      statuses.push(APPLICATION_STATUS.SITUATIONAL_JUDGEMENT_PASSED);
      statuses.push(APPLICATION_STATUS.SITUATIONAL_JUDGEMENT_FAILED);
    }
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST) >= 0) {
      statuses.push(APPLICATION_STATUS.CRITICAL_ANALYSIS_PASSED);
      statuses.push(APPLICATION_STATUS.CRITICAL_ANALYSIS_FAILED);
    }
    if (
      exercise.shortlistingMethods.indexOf(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST) >= 0 &&
      exercise.shortlistingMethods.indexOf(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST) >= 0
    ) {
      statuses.push(APPLICATION_STATUS.QUALIFYING_TEST_PASSED);
      statuses.push(APPLICATION_STATUS.QUALIFYING_TEST_FAILED);
    }
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST) >= 0) {
      statuses.push(APPLICATION_STATUS.SCENARIO_TEST_PASSED);
      statuses.push(APPLICATION_STATUS.SCENARIO_TEST_FAILED);
    }
    if (
      exercise.shortlistingMethods.indexOf(SHORTLISTING.NAME_BLIND_PAPER_SIFT) >= 0 ||
      exercise.shortlistingMethods.indexOf(SHORTLISTING.PAPER_SIFT) >= 0
    ) {
      statuses.push(APPLICATION_STATUS.SIFT_PASSED);
      statuses.push(APPLICATION_STATUS.SIFT_FAILED);
    }
    if (exercise.shortlistingMethods.indexOf(SHORTLISTING.TELEPHONE_ASSESSMENT) >= 0) {
      statuses.push(APPLICATION_STATUS.TELEPHONE_ASSESSMENT_PASSED);
      statuses.push(APPLICATION_STATUS.TELEPHONE_ASSESSMENT_FAILED);
    }
  }
  return statuses;
}
