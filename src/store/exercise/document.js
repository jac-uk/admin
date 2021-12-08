import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';
import { APPLICATION_STEPS, exerciseApplicationParts, configuredApplicationParts } from '@/helpers/exerciseHelper';

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
          data.createdOn = firebase.firestore.FieldValue.serverTimestamp(),
          transaction.set(exerciseRef, data);
          return exerciseRef.id;
        });
      }).then((newId) => {
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
      await collection.doc(state.record.id).update(saveData);
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
  },
};
