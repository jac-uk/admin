/*eslint func-style: ["error", "declaration"]*/
import clone from 'clone';
import { ADVERT_TYPES } from '@/helpers/constants';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';

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
unselectedApplicationParts,
*/

export {
  APPLICATION_STEPS,
  CAPABILITIES,
  GRADES,
  GRADE_VALUES,
  SELECTION_CATEGORIES,
  TASKS,
  TASK_STATUS,
  TASK_TYPE,
  taskApplicationsStageAndStatus,
  taskNextStatus,
  emptyScoreSheet,
  exerciseStates,
  exerciseAdvertTypes,
  applicationContentSteps,
  configuredApplicationContentSteps,
  isEditable,
  isApproved,
  isProcessing,
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
  currentState,
  applicationContentList,
  exerciseApplicationParts, // TODO review naming of applicationParts methods :)
  applicationPartsMap,
  applicationParts,
  selectedApplicationParts,
  unselectedApplicationParts,
  configuredApplicationParts,
  currentApplicationParts,
  isMoreInformationNeeded,
  isApplicationComplete,
  hasApplicationProcess,
  applicationCounts,
  applicationRecordCounts
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

const CAPABILITIES = ['L', 'EJ', 'L&J', 'PQ', 'PBK', 'ACI', 'WCO', 'MWE', 'OVERALL'];
const GRADES = ['A', 'B', 'C', 'D'];
const GRADE_VALUES = {
  'A': 4,
  'B': 3,
  'C': 2,
  'D': 1,
};
const SELECTION_CATEGORIES = ['leadership', 'roleplay', 'situational', 'interview', 'overall'];

const TASK_TYPE = {
  SIFT: 'sift',
  SELECTION: 'selection',
  SCENARIO: 'scenario',
};

const TASKS = [
  TASK_TYPE.SIFT,
  TASK_TYPE.SCENARIO,
  TASK_TYPE.SELECTION,
];

const TASK_STATUS = {
  INITIALISED: 'initialised',
  ACTIVATED: 'activated',
  MODERATION_INITIALISED: 'moderationInitialised',
  MODERATION_ACTIVATED: 'moderationActivated',
  FINALISED: 'finalised',
  COMPLETED: 'completed',
};

function taskNextStatus(currentStatus) {
  let nextStatus;
  switch (currentStatus) {
    case TASK_STATUS.INITIALISED:
      nextStatus = TASK_STATUS.ACTIVATED;
      break;
    case TASK_STATUS.ACTIVATED: // skip moderation
      // nextStatus = TASK_STATUS.MODERATION_INITIALISED;
      nextStatus = TASK_STATUS.FINALISED;
      break;
    case TASK_STATUS.MODERATION_INITIALISED:
      nextStatus = TASK_STATUS.MODERATION_ACTIVATED;
      break;
    case TASK_STATUS.MODERATION_ACTIVATED:
      nextStatus = TASK_STATUS.FINALISED;
      break;
    case TASK_STATUS.FINALISED:
      nextStatus = TASK_STATUS.COMPLETED;
      break;
    case TASK_STATUS.COMPLETED:
      nextStatus = TASK_STATUS.COMPLETED;
      break;
    default:
      nextStatus = TASK_STATUS.INITIALISED;
  }
  return nextStatus;
}

function taskApplicationsStageAndStatus(type) {
  const params = {};
  switch (type) {
    case TASK_TYPE.SIFT:
      params.stage = EXERCISE_STAGE.REVIEW;
      break;
    case TASK_TYPE.SELECTION:
      params.stage = EXERCISE_STAGE.SELECTED;
      break;
    case TASK_TYPE.SCENARIO:
      params.stage = EXERCISE_STAGE.REVIEW;
      params.status = APPLICATION_STATUS.PASSED_FIRST_TEST;
      break;
  }
  return params;
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
function isEditable(data) {
  if (data === null) return false;
  switch (data.state) {
    case 'draft':
    case 'ready':
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
  switch (data.assessmentOptions) {
    case 'statement-of-suitability-with-competencies':
    case 'statement-of-suitability-with-skills-and-abilities':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv':
    case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
      return true;
    default:
      return false;
  }
}
function hasCoveringLetter(data) {
  switch (data.assessmentOptions) {
    case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
    case 'self-assessment-with-competencies-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
      return true;
    default:
      return false;
  }
}

function hasCV(data) {
  switch (data.assessmentOptions) {
    case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv':
      return true;
    default:
      return false;
  }
}
function hasStatementOfEligibility(data) {
  switch (data.assessmentOptions) {
    case 'statement-of-eligibility':
      return !!(data.aSCApply && data.selectionCriteria && data.selectionCriteria.length);
    default:
      return false;
  }
}
function hasSelfAssessment(data) {
  switch (data.assessmentOptions) {
    case 'self-assessment-with-competencies':
    case 'self-assessment-with-competencies-and-cv':
    case 'self-assessment-with-competencies-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
      return true;
    default:
      return false;
  }
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
