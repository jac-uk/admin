import { doc, collection, deleteDoc, updateDoc, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collectionName = 'candidateForms';
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
    open: async (context, formId) => {
      const saveData = {};
      saveData.status = 'open';
      saveData['statusLog.open'] = serverTimestamp();
      await context.dispatch('update', { saveData, formId });
    },
    close: async (context, formId) => {
      const saveData = {};
      saveData.status = 'closed';
      saveData['statusLog.closed'] = serverTimestamp();
      await context.dispatch('update', { saveData, formId });
    },
    update: async (context, { saveData, formId }) => {
      const ref = doc(collectionRef, formId);
      saveData.lastUpdated = serverTimestamp();
      await updateDoc(ref, saveData);
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
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
