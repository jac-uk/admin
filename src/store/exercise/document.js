import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
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
    create: async ({ dispatch }, data) => {
      const metaRef = firestore.collection('meta').doc('stats');
      return firestore.runTransaction((transaction) => {
        return transaction.get(metaRef).then((metaDoc) => {
          const newExercisesCount = metaDoc.data().exercisesCount + 1;
          const exerciseRef = firestore.collection('exercises').doc();
          transaction.update(metaRef, { exercisesCount: newExercisesCount });
          data.referenceNumber = 'JAC' + (100000 + newExercisesCount).toString().substr(1);
          data.progress = { started: true };
          data.state = 'draft';
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
  },
};
