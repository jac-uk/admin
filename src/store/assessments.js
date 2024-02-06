// TODO: KO upgrade to modular API
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('exercise.id', '==', params.exerciseId);

      if (params.applicationRef) {
        firestoreRef = firestoreRef.where('application.referenceNumber', '==', params.applicationRef);
      }

      if (params.status === 'draft') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.assessmentsNotRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsNotRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'pending') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.assessmentsRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'completed') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.assessmentsCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'cancelled') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.assessmentsCancelledRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsCancelledRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'declined') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
        firestoreRef = await tableQuery(state.assessmentsDeclinedRecords, firestoreRef, params);
        return bindFirestoreRef('assessmentsDeclinedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'deleted') {
        firestoreRef = firestoreRef.where('status', '==', params.status);
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
