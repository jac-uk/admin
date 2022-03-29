import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { functions } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';
import { APPLICATION_STEPS, exerciseApplicationParts, configuredApplicationParts } from '@/helpers/exerciseHelper';
import copyToQTFirestore from '../../helpers/copyToQTFirestore';

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
        copyToQTFirestore('exercises', newId);
        return dispatch('bind', newId);
      });
    },
    save: async ({ state }, data) => {
      const saveData = clone(data);
      if (JSON.stringify(saveData).indexOf('_applicationContent') === -1) {  // recalculate applicationContent (if necessary)
        const applicationParts = exerciseApplicationParts(state.record, data);
        const existingApplicationParts = configuredApplicationParts(state.record);
        const newApplicationParts = applicationParts.filter(part => existingApplicationParts.indexOf(part) === -1);
        if (newApplicationParts.length || existingApplicationParts.length !== applicationParts.length) {
          const applicationContentBefore = state.record._applicationContent ? state.record._applicationContent : {};
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
      const id = state.record.id;
      await collection.doc(id).update(saveData);
      copyToQTFirestore('exercises', id);
    },
    submitForApproval: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'ready',
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    approve: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'approved',
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'draft',
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    publish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: true,
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    unpublish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: false,
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    addToFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayUnion(userId),
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    removeFromFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayRemove(userId),
      };
      await ref.update(data);
      copyToQTFirestore('exercises', id);
    },
    refreshApplicationCounts: async ({ state }) => {
      if (state.record) {
        const id = state.record.id;
        await functions.httpsCallable('refreshApplicationCounts')({ exerciseId: id });
        copyToQTFirestore('exercises', id);
      }
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      return state.record === null ? null : state.record.id;
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
  },
};
