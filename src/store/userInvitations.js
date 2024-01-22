import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('userInvitations');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collection;
      if (params.status === 'pending') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.userInvitationPendingRecords, firestoreRef, params);
        return bindFirestoreRef('userInvitationPendingRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'completed') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.userInvitationCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('userInvitationCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
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
    getByEmail: async (_, { email, status }) => {
      if (!email) return null;

      try {
        let firestoreRef = collection.where('email', '==', email);
        if (status) {
          firestoreRef = firestoreRef.where('status', '==', status);
        }
        const snap = await firestoreRef.limit(1).get();
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
    userInvitationPendingRecords: [],
    userInvitationCompletedRecords: [],
    record: null,
  },
  getters: {},
};
