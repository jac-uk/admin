import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('active', '==', true);

      if (params.where.length === 0) {
        firestoreRef = firestoreRef.where('stage', 'in', [EXERCISE_STAGE.SHORTLISTED, EXERCISE_STAGE.SELECTED, EXERCISE_STAGE.RECOMMENDED]);
      }

      if (params.requested === true) {
        firestoreRef = firestoreRef.where('characterChecks.status', '==', 'requested');
        firestoreRef = tableQuery(state.checksRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('checksRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      } else {
        firestoreRef = firestoreRef.where('characterChecks.status', '==', 'not requested');
        firestoreRef = tableQuery(state.checksNotRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('checksNotRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('checksRequestedRecords');
      unbindFirestoreRef('checksNotRequestedRecords');
      return true;
    }),
  },
  state: {
    checksRequestedRecords: [],
    checksNotRequestedRecords: [],
  },
};
