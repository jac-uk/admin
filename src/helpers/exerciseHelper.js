/*eslint func-style: ["error", "declaration"]*/
import clone from 'clone';

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
  processingStages,
  isEditable,
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
  isApplicationComplete
};

// application process config
const APPLICATION_STEPS = ['registration', 'qualifying', 'shortlisting', 'selection', 'recommendation', 'handover'];
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

function processingStages(data) {
  if (!data) { return []; }
  const stages = [];
  if (hasQualifyingTests(data)) {
    stages.push('qualifying');
  }
  if (hasShortlisting(data)) {
    stages.push('shortlisting');
  }
  if (hasSelectionDay(data)) {
    stages.push('selection');
  }
  stages.push('recommendation');
  stages.push('handover');
  return stages;
}
function hasShortlisting(data) {
  if (!data) { return false; }
  return true;
}
function hasSelectionDay(data) {
  if (!data) { return false; }
  return true;
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
      return true;
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
  return APPLICATION_STEPS.indexOf(data.state) >= 0 ? data.state : 'registration';
}
function applicationContentList(data) {  // returns applicationContent map as an array
  const applicationContentList = [];
  if (data && data.applicationContent) {
    const steps = ['registration'].concat(processingStages(data));
    steps.forEach(step => {
      if (data.applicationContent[step]) {
        const selectedParts = [];
        APPLICATION_PARTS.forEach(part => {
          if (data.applicationContent[step][part]) {
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
  if (data && data.applicationContent) {
    Object.entries(data.applicationContent).forEach((keyValue) => {
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
  if (data && data.applicationContent) {
    Object.entries(data.applicationContent).forEach((keyValue) => {
      configuredParts = configuredParts.concat(Object.entries(keyValue[1]).map(part => part[0]).filter(part => configuredParts.indexOf(part) === -1));
    });
  }
  return configuredParts;
}

// application parts up to and including current stage
function applicationParts(data) {
  if (data.applicationContent) {
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
  if (data.applicationContent && data.state) {
    return data.applicationContent[currentState(data)];
  }
  return [];
}
// are there application parts in current stage (not registration)
function isMoreInformationNeeded(data) {
  if (data.applicationContent && data.state) {
    if (
      data.state !== 'registration'
      && APPLICATION_STEPS.indexOf(data.state) >= 0
      && Object.keys(currentApplicationParts(data)).length
    ) {
      return true;
    }
  }
  return false;
}
function isApplicationComplete(vacancy, application) {
  if (!(application && application.progress)) return false;
  const applicationParts = applicationParts(vacancy);
  if (!applicationParts) return false;
  const partsToComplete = Object.keys(applicationParts).filter(part => applicationParts[part] === true);
  const incompleteParts = partsToComplete.filter(part => application.progress[part] !== true);
  return incompleteParts.length === 0;
}
