import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
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
    bindDoc: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async (_, { id, data }) => {
      if (id) {
        await collection.doc(id).set(data);
        return { id, ...data };
      }
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
    set(state, { name, value }) {
      state[name] = value;
    },
    records(state, data) {
      state.records = data;
    },
    setRecord(state, data) {
      state.record = data;
    },
    setUsers(state, users) {
      state.users = users;
    },
  },
  state: {
    records: [],
    record: null,
    users: [],
  },
  getters: {
    enabledMicrosoftUsers: (state) => {
      if (!Array.isArray(state.records)) return [];
      return state.records
        .filter(user => {
          if (user.disabled) return false;
          let isMicrosoft = false;
          user.providerData.forEach(item => {
            if (item.providerId === 'microsoft.com') {
              isMicrosoft = true;
            }
          });
          return isMicrosoft;
        });
    },
  },
};
