import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collection = firestore.collection('qualifyingTestReports');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collection
        .where('exercise.id', '==', params.exerciseId);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
  },
  getters: {
    data: (state) => {
      return state.records.map(item => {
        const report = item;
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
      });
    },
  },
  state: {
    records: [],
  },
};
