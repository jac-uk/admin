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
    close: async (context, formId) => {
      const ref = collection.doc(formId);
      const saveData = {};
      saveData.status = 'closed';
      saveData['statusLog.closed'] = firebase.firestore.FieldValue.serverTimestamp();
      saveData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.set(saveData, { merge: true });
    },
    update: async (context, { saveData, formId }) => {
      const ref = formId ? collection.doc(formId) : collection.doc();
      saveData.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      if (formId) {
        await ref.update(saveData);
      } else {
        saveData.status = 'created';
        saveData.statusLog = { created: firebase.firestore.FieldValue.serverTimestamp() };
        await ref.set(saveData, { merge: true });  
      }
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
