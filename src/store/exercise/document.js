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
  },
};
