import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('userInvitations');

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
    bindDoc: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    get: async (_, { email, status }) => {
      try {
        const snap = await collection
          .where('email', '==', email)
          .where('status', '==', status)
          .limit(1)
          .get();
        let result = null;
        snap.forEach(doc => {
          result = {
            id: doc.id,
            ...doc.data(),
          };
        });
        return result;
      } catch (error) {
        return null;
      }
    },
    create: async (_, data) => {
      return await collection.add(data);
    },
    save: async (_, { id, data }) => {
      const ref = collection.doc(id);
      await ref.set(data, { merge: true });
    },
    delete: async (_, id) => {
      console.log(id);
      return await collection.doc(id).delete();
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    records: [],
    record: null,
  },
  getters: {},
};
