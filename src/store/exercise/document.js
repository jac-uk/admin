import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';

const collection = firestore.collection('exercises');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef);
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async ({ dispatch }, data) => {
      const ref = await collection.add(data);
      return dispatch('bind', ref.id);
    },
  },
  state: {
    record: null,
  },
};
