import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collection = firestore.collection('qualifyingTestReports');

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
      data.created = firebase.firestore.FieldValue.serverTimestamp();
      data.lastUpdated = null;
      const doc = await collection.add(data);
      return doc.id;
    },
    save: async (context, data) => {
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      return await collection.doc(context.state.record.id).update(data);
    },
  },
  state: {
    record: null,
  },
};
