import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import tableQuery from '@/helpers/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('exercise.id', '==', params.exerciseId);
      if (params.applicationRef) {
        firestoreRef = firestoreRef.where('application.referenceNumber', '==', params.applicationRef);
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
  },
  state: {
    records: [],
  },
};
