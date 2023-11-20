import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('active', '==', true);

      if (params.where.length === 0) {
        firestoreRef = firestoreRef.where('stage', 'in', [EXERCISE_STAGE.SHORTLISTED]);
      }

      firestoreRef = firestoreRef.where('preSelectionDayQuestionnaire.status', '==', params.status);
      if (params.status === 'created') {
        firestoreRef = await tableQuery(state.preSelectionDayQuestionnairesCreatedRecords, firestoreRef, params);
        return bindFirestoreRef('preSelectionDayQuestionnairesCreatedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'requested') {
        firestoreRef = await tableQuery(state.preSelectionDayQuestionnairesRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('preSelectionDayQuestionnairesRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else if (params.status === 'completed') {
        firestoreRef = await tableQuery(state.preSelectionDayQuestionnairesCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('preSelectionDayQuestionnairesCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('preSelectionDayQuestionnairesCreatedRecords');
      unbindFirestoreRef('preSelectionDayQuestionnairesRequestedRecords');
      unbindFirestoreRef('preSelectionDayQuestionnairesCompletedRecords');
      return true;
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    preSelectionDayQuestionnairesCreatedRecords: [],
    preSelectionDayQuestionnairesRequestedRecords: [],
    preSelectionDayQuestionnairesCompletedRecords: [],
  },
};
