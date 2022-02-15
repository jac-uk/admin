import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('panellists');

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
    create: async (context, data) => {
      const ref = collection.doc();
      data.created = firebase.firestore.FieldValue.serverTimestamp();
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.set(data, { merge: true });
      return ref.id;
    },
    update: async (context, { data, id }) => {
      const ref = collection.doc(id);
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.set(data, { merge: true });
    },
    delete: async (context, id) => {
      await collection.doc(id).delete();
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
