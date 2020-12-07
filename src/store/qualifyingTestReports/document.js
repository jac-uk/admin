import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

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
  getters: {
    data: (state) => {
      const report = clone(state.record);
      const titles = [];
      report.qualifyingTests.forEach(qualifyingTest => {
        titles.push(qualifyingTest.title);
      });
      let title = titles.join(' + ');
      if (report.filters && report.filters.jurisdiction) {
        title = `${title} (${report.filters.jurisdiction})`;
      }
      report.title = title;
      return report;
    },
  },
  state: {
    record: null,
  },
};
