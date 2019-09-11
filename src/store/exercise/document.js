import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

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
      const ref = await collection.add(data);
      return dispatch('bind', ref.id);
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
};
