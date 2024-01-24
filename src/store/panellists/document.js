import { doc, collection, setDoc, deleteDoc, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collectionName = 'panellists';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async (context, data) => {
      const ref = doc(collectionRef);
      data.created = serverTimestamp();
      data.lastUpdated = serverTimestamp();
      await setDoc(ref, data, { merge: true });
      return ref.id;
    },
    update: async (context, { data, id }) => {
      const ref = doc(collectionRef, id);
      data.lastUpdated = serverTimestamp();
      await setDoc(ref, data, { merge: true });
    },
    delete: async (context, id) => {
      await deleteDoc(doc(collectionRef, id));
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;
      return state.record.id;
    },
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
