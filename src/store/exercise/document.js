import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('exercises');

// exercise helpers
const hasIndependentAssessments = (data) => {
  return !(data.assessmentMethods && data.assessmentMethods.independentAssessments === false);
};
const hasLeadershipJudgeAssessment = (data) => {
  return data.assessmentMethods && data.assessmentMethods.leadershipJudgeAssessment;
};
const hasQualifyingTests = (data) => {
  if (!data.shortlistingMethods || data.shortlistingMethods.length === 0) return false;
  if (data.shortlistingMethods.indexOf('situational-judgement-qualifying-test') >= 0) return true;
  if (data.shortlistingMethods.indexOf('critical-analysis-qualifying-test') >= 0) return true;
  if (data.shortlistingMethods.indexOf('scenario-test-qualifying-test') >= 0) return true;
  return false;
};
const hasRelevantMemberships = (data) => {
  if (isNonLegal(data)) {
    if (data.memberships && data.memberships.length) {
      if (data.memberships.indexOf('none') === -1) {
        return true;
      }
    }
  }
  return false;
};
const hasStatementOfSuitability = (data) => {
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
};
const hasCoveringLetter = (data) => {
  switch (data.assessmentOptions) {
    case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
    case 'self-assessment-with-competencies-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
      return true;
    default:
      return false;
  }
};

const hasCV = (data) => {
  switch (data.assessmentOptions) {
    case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
    case 'statement-of-suitability-with-skills-and-abilities-and-cv':
      return true;
    default:
      return false;
  }
};
const hasStatementOfEligibility = (data) => {
  switch (data.assessmentOptions) {
    case 'statement-of-eligibility':
      return true;
    default:
      return false;
  }
};
const hasSelfAssessment = (data) => {
  switch (data.assessmentOptions) {
    case 'self-assessment-with-competencies':
    case 'self-assessment-with-competencies-and-cv':
    case 'self-assessment-with-competencies-and-covering-letter':
    case 'self-assessment-with-competencies-and-cv-and-covering-letter':
      return true;
    default:
      return false;
  }
};
const isLegal = (data) => {
  return data.typeOfExercise === 'legal' || data.typeOfExercise === 'leadership';
};
const isNonLegal = (data) => {
  return data.typeOfExercise === 'non-legal' || data.typeOfExercise === 'leadership-non-legal';
};
const isTribunal = (data) => {
  return data.isCourtOrTribunal === 'tribunal';
};

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async ({ rootState, dispatch }, data) => {
      const metaRef = firestore.collection('meta').doc('stats');
      return firestore.runTransaction((transaction) => {
        return transaction.get(metaRef).then((metaDoc) => {
          const newExercisesCount = metaDoc.data().exercisesCount + 1;
          const exerciseRef = firestore.collection('exercises').doc();
          transaction.update(metaRef, { exercisesCount: newExercisesCount });
          data.referenceNumber = `JAC${  (100000 + newExercisesCount).toString().substr(1)}`;
          data.progress = { started: true };
          data.state = 'draft';
          data._applicationVersion = 2;
          data.favouriteOf = firebase.firestore.FieldValue.arrayUnion(rootState.auth.currentUser.uid);
          data.createdBy = rootState.auth.currentUser.uid;
          transaction.set(exerciseRef, data);
          return exerciseRef.id;
        });
      }).then((newId) => {
        return dispatch('bind', newId);
      });
    },
    save: async ({ state, getters }, data) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const saveData = clone(data);
      if (Object.keys(saveData).indexOf('applicationContent') === -1) {  // recalculate applicationContent
        const applicationParts = getters.getApplicationParts(data);
        const registrationParts = {};
        const existingValues = state.record.applicationContent ? state.record.applicationContent.registration : {};
        applicationParts.forEach(key => {
          registrationParts[key] = existingValues[key] !== undefined ? existingValues[key] : true;  // default is to include new parts
        });
        saveData['applicationContent.registration'] = registrationParts;
      }
      await ref.update(saveData);
    },
    submitForApproval: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'ready',
      };
      await ref.update(data);
    },
    approve: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'approved',
      };
      await ref.update(data);
    },
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'draft',
      };
      await ref.update(data);
    },
    publish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: true,
      };
      await ref.update(data);
    },
    unpublish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: false,
      };
      await ref.update(data);
    },
    addToFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayUnion(userId),
      };
      await ref.update(data);
    },
    removeFromFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayRemove(userId),
      };
      await ref.update(data);
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;

      return state.record.id;
    },
    data: (state) => (objectToPopulate) => {
      const data = clone(state.record);
      if (objectToPopulate) {
        Object.keys(objectToPopulate).forEach(key => {
          if (data[key] !== undefined) {
            objectToPopulate[key] = data[key];
          }
        });
        return objectToPopulate;
      } else {
        return data;
      }
    },
    isEditable: (state) => {
      if (state.record === null) return true;

      if (state.record) {
        switch (state.record.state) {
        case 'draft':
        case 'ready':
          return true;
        default:
          return false;
        }
      }
    },
    hasIndependentAssessments: (state) => {
      if (state.record === null) return true;
      return hasIndependentAssessments(state.record);
    },
    hasLeadershipJudgeAssessment: (state) => {
      if (state.record === null) return true;
      return hasLeadershipJudgeAssessment(state.record);
    },
    hasQualifyingTests: (state) => {
      if (state.record === null) return false;
      return hasQualifyingTests(state.record);
    },
    hasRelevantMemberships: (state) => {
      if (state.record === null) return false;
      return hasRelevantMemberships(state.record);
    },
    hasStatementOfSuitability: (state) => {
      if (state.record === null) return false;
      return hasStatementOfSuitability(state.record);
    },
    hasCoveringLetter: (state) => {
      if (state.record === null) return false;
      return hasCoveringLetter(state.record);
    },
    hasCV: (state) => {
      if (state.record === null) return false;
      return hasCV(state.record);
    },
    hasStatementOfEligibility: (state) => {
      if (state.record === null) return false;
      return hasStatementOfEligibility(state.record);
    },
    hasSelfAssessment: (state) => {
      if (state.record === null) return false;
      return hasSelfAssessment(state.record);
    },
    isLegal: (state) => {
      if (state.record === null) return false;
      return isLegal(state.record);
    },
    isNonLegal: (state) => {
      if (state.record === null) return false;
      return isNonLegal(state.record);
    },
    isTribunal: (state) => {
      if (state.record === null) return false;
      return isTribunal(state.record);
    },
    getApplicationParts: (state) => (data) => {
      if (state.record === null) return [];
      const exercise = clone(state.record);
      if (data) {  // override stored values with passed in data
        Object.keys(data).forEach(key => {
          exercise[key] = data[key];
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
      applicationParts.push('additionalInformation');
      return applicationParts;
    },
    getApplicationPartsMap: (state, getters) => {
      const applicationParts = getters.getApplicationParts();
      const applicationPartsMap = {};
      applicationParts.forEach(part => applicationPartsMap[part] = true);
      return applicationPartsMap;
    },
  },
};
