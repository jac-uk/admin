import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('candidateForms');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    open: async (context, formId) => {
      const saveData = {};
      saveData.status = 'open';
      saveData['statusLog.open'] = firebase.firestore.FieldValue.serverTimestamp();
      await context.dispatch('update', { saveData, formId });
    },
    close: async (context, formId) => {
      const saveData = {};
      saveData.status = 'closed';
      saveData['statusLog.closed'] = firebase.firestore.FieldValue.serverTimestamp();
      await context.dispatch('update', { saveData, formId });      
    },
    update: async (context, { saveData, formId }) => {
      const ref = collection.doc(formId);
      saveData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.update(saveData);
    },
    delete: async (context, id) => {
      await collection.doc(id).delete();
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
