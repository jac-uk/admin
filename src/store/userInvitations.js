import { query, doc, collection, addDoc, setDoc, getDocs, deleteDoc, where, limit } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'userInvitations';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collectionRef;
      if (params.status === 'pending') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.userInvitationPendingRecords, firestoreRef, params);
        return bindFirestoreRef('userInvitationPendingRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'completed') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.userInvitationCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('userInvitationCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindDoc: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    getByEmail: async (_, { email, status }) => {
      if (!email) return null;

      try {
        let firestoreRef = query(collectionRef, where('email', '==', email.toLowerCase()));
        if (status) {
          firestoreRef = query(firestoreRef, where('status', '==', status));
        }
        const snap = await getDocs(query(firestoreRef, limit(1)));
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
      return await addDoc(collectionRef, data);
    },
    save: async (_, { id, data }) => {
      const ref = doc(collectionRef, id);
      await setDoc(ref, data, { merge: true });
    },
    delete: async (_, id) => {
      console.log(id);
      return await deleteDoc(doc(collectionRef, id));
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
