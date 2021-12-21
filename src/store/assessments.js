import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('exercise.id', '==', params.exerciseId);
      if (params.applicationRef) {
        firestoreRef = firestoreRef.where('application.referenceNumber', '==', params.applicationRef);
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
  },
  mutations: {
    records(state, data) {
      state.records = data;
    },
  },
  state: {
    records: [],
  },
};
