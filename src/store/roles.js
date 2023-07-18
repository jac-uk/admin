import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('roles');

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
    get: async (_, roleId) => {
      try {
        const doc = await collection.doc(roleId).get();
        if (doc.exists) {
          return {
            id: roleId,
            ...doc.data(),
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    save: async (_, { roleId, data }) => {
      const ref = collection.doc(roleId);
      return await ref.set(data, { merge: true });
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
