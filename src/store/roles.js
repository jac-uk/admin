import { doc, collection, addDoc, setDoc } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'roles';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      const firestoreRef = await tableQuery(state.records, collectionRef, params);
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
      return await addDoc(collectionRef, data);
    },
    save: async (_, { roleId, data }) => {
      const ref = doc(collectionRef, roleId);
      return await setDoc(ref, data, { merge: true });
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
  },
  state: {
    records: [],
    record: null,
  },
};
