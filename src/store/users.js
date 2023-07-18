import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('users');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      const firestoreRef = await tableQuery(state.records, collection, params);
      if (firestoreRef) {
        return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      } else {
        commit('records', []);
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    create: async (_, data) => {
      return await collection.add(data);
    },
    get: async (_, userId) => {
      try {
        const doc = await collection.doc(userId).get();
        if (doc.exists) {
          return {
            id: userId,
            ...doc.data(),
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    save: async (_, { userId, data }) => {
      const ref = collection.doc(userId);
      await ref.set(data, { merge: true });
    },
    delete: async (_, id) => {
      return await collection.doc(id).delete();
    },
  },
  mutations: {
    records(state, data) {
      state.records = data;
    },
    setRecord(state, data) {
      state.record = data;
    },
  },
  state: {
    records: [],
    record: null,
  },
};
