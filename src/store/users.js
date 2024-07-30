import { query, doc, collection, setDoc, addDoc, getDoc, getDocs, deleteDoc, where, limit } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'users';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      let firestoreRef = collectionRef;
      if (params.roleId) {
        firestoreRef = query(firestoreRef, where('role.id', '==', params.roleId));
      }
      firestoreRef = await tableQuery(state.records, firestoreRef, params);
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
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async (_, { id, data }) => {
      if (id) {
        await setDoc(doc(collectionRef, id), data);
        return { id, ...data };
      }
      return await addDoc(collectionRef, data);
    },
    getById: async (_, userId) => {
      if (!userId) return null;

      try {
        const snap = await getDoc(doc(collectionRef, userId));
        if (snap.exists()) {
          return {
            id: userId,
            ...snap.data(),
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    getByEmail: async (_, email) => {
      if (!email) return null;

      try {
        const snap = await getDocs(
          query(
            collectionRef,
            where('email', '==', email),
            limit(1)
          )
        );
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
    save: async (_, { userId, data }) => {
      const ref = doc(collectionRef, userId);
      await setDoc(ref, data, { merge: true });
    },
    delete: async (_, id) => {
      return await deleteDoc(doc(collectionRef, id));
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
    enabledJACUsers: (state) => {
      if (!Array.isArray(state.records)) return [];
      return state.records
        .filter(user => {
          if (user.disabled) return false;  // user account has been disabled
          if (!(user.role && user.role.id)) return false;  // user doesn't have a role
          if (!(user.email && user.email.split('@')[1].toLowerCase() === 'judicialappointments.gov.uk')) return false;  // user isn't using @judicialappointments.gov.uk email address
          return true;
        })
        .sort((a, b) => {
          a = a.displayName ? a.displayName.toLowerCase() : a.email;
          b = b.displayName ? b.displayName.toLowerCase() : b.email;
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
    },
    getUsersByRoleId: (state) => (roleId) => {
      if (!Array.isArray(state.records)) return [];
      return state.records.filter(user => user.role.id === roleId);
    },
  },
};
