import { query, collection, where } from '@firebase/firestore';
import { firestore } from '@/firebase';
<<<<<<< Updated upstream
import { firestoreAction } from '@jac-uk/jac-kit/helpers';
=======
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
>>>>>>> Stashed changes
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'assessments'),
        where('exercise.id', '==', params.exerciseId)
      );

      if (params.applicationRef) {
        firestoreRef = query(firestoreRef, where('application.referenceNumber', '==', params.applicationRef));
      }

      if (params.status === 'draft') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsNotRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsNotRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'pending') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'completed') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'cancelled') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsCancelledRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsCancelledRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'declined') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsDeclinedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsDeclinedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'deleted') {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
        firestoreRef = await tableQuery(state.assessmentsDeletedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsDeletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('assessmentsNotRequestedRecords');
      unbindFirestoreRef('assessmentsRequestedRecords');
      unbindFirestoreRef('assessmentsCompletedRecords');
      unbindFirestoreRef('assessmentsCancelledRecords');
      unbindFirestoreRef('assessmentsDeclinedRecords');
      unbindFirestoreRef('assessmentsDeletedRecords');
      return true;
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    assessmentsNotRequestedRecords: [],
    assessmentsRequestedRecords: [],
    assessmentsCompletedRecords: [],
    assessmentsCancelledRecords: [],
    assessmentsDeclinedRecords: [],
    assessmentsDeletedRecords: [],
  },
};
