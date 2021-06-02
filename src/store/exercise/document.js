import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('exercises');

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
    save: async ({ state }, data) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      await ref.update(data);
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
    data: (state) => () => {
      return clone(state.record);
    },
    //record: (state) => clone(state.record),
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
      return !(state.record.assessmentMethods && state.record.assessmentMethods.independentAssessments === false);
    },
    hasLeadershipJudgeAssessment: (state) => {
      if (state.record === null) return true;
      return state.record.assessmentMethods && state.record.assessmentMethods.leadershipJudgeAssessment;
    },
    hasQualifyingTests: (state) => {
      if (state.record === null) return false;
      if (!state.record.shortlistingMethods || state.record.shortlistingMethods.length === 0) return false;
      if (state.record.shortlistingMethods.indexOf('situational-judgement-qualifying-test') >= 0) return true;
      if (state.record.shortlistingMethods.indexOf('critical-analysis-qualifying-test') >= 0) return true;
      if (state.record.shortlistingMethods.indexOf('scenario-test-qualifying-test') >= 0) return true;
      return false;
    },
    hasRelevantMemberships: (state, getters) => {
      if (state.record === null) return false;
      if (getters.isNonLegal) {
        if (state.record.memberships && state.record.memberships.length) {
          if (state.record.memberships.indexOf('none') === -1) {
            return true;
          }
        }
      }
      return false;
    },
    hasStatementOfSuitability: (state) => {
      if (state.record === null) return false;
      switch (state.record.assessmentOptions) {
        case 'statement-of-suitability-with-competencies':
        case 'statement-of-suitability-with-skills-and-abilities':
        case 'statement-of-suitability-with-skills-and-abilities-and-cv':
        case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
        case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
          return true;
        default:
          return false;
      }
    },
    hasCoveringLetter: (state) => {
      if (state.record === null) return false;
      switch (state.record.assessmentOptions) {
        case 'statement-of-suitability-with-skills-and-abilities-and-covering-letter':
        case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
        case 'self-assessment-with-competencies-and-covering-letter':
        case 'self-assessment-with-competencies-and-cv-and-covering-letter':
          return true;
        default:
          return false;
      }
    },
    hasCV: (state) => {
      if (state.record === null) return false;
      switch (state.record.assessmentOptions) {
        case 'statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter':
        case 'self-assessment-with-competencies-and-cv':
        case 'self-assessment-with-competencies-and-cv-and-covering-letter':
        case 'statement-of-suitability-with-skills-and-abilities-and-cv':
          return true;
        default:
          return false;
      }
    },
    hasStatementOfEligibility: (state) => {
      if (state.record === null) return false;
      switch (state.record.assessmentOptions) {
        case 'statement-of-eligibility':
          return true;
        default:
          return false;
      }
    },
    hasSelfAssessment: (state) => {
      if (state.record === null) return false;
      switch (state.record.assessmentOptions) {
        case 'self-assessment-with-competencies':
        case 'self-assessment-with-competencies-and-cv':
        case 'self-assessment-with-competencies-and-covering-letter':
        case 'self-assessment-with-competencies-and-cv-and-covering-letter':
          return true;
        default:
          return false;
      }
    },
    isLegal: (state) => {
      if (state.record === null) return false;
      return state.record.typeOfExercise === 'legal' || state.record.typeOfExercise === 'leadership';
    },
    isNonLegal: (state) => {
      if (state.record === null) return false;
      return state.record.typeOfExercise === 'non-legal' || state.record.typeOfExercise === 'leadership-non-legal';
    },
    getApplicationParts: (state, getters) => {
      if (state.record === null) return [];
      const exercise = state.record;
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
      if (getters.isLegal) {
        applicationParts.push('relevantQualifications');
        applicationParts.push('postQualificationWorkExperience');
        if (exercise.previousJudicialExperienceApply) {
          applicationParts.push('judicialExperience');
        }
        applicationParts.push('employmentGaps');
        applicationParts.push('reasonableLengthOfService');
      }
      if (getters.isNonLegal) {
        if (getters.hasRelevantMemberships) {
          applicationParts.push('relevantMemberships');
        }
        applicationParts.push('relevantExperience');
        applicationParts.push('employmentGaps');
        applicationParts.push('reasonableLengthOfService');
      }
      if (getters.hasIndependentAssessments) {
        applicationParts.push('assessorsDetails');
      }
      if (getters.hasLeadershipJudgeAssessment) {
        applicationParts.push('leadershipJudgeDetails');
      }
      if (getters.hasStatementOfSuitability) {
        applicationParts.push('statementOfSuitability');
      }
      if (getters.hasCV) {
        applicationParts.push('cv');
      }
      if (getters.hasCoveringLetter) {
        applicationParts.push('coveringLetter');
      }
      if (getters.hasStatementOfEligibility) {
        applicationParts.push('statementOfEligibility');
      }
      if (getters.hasSelfAssessmentCompetencies) {
        applicationParts.push('selfAssessmentCompetencies');
      }
      if (getters.hasAdditionalInfo) {
        applicationParts.push('additionalInfo');
      }
      return applicationParts;
    },
  },
};
