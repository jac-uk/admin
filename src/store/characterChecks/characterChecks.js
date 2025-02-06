import { query, doc, writeBatch, collection, where, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { EXERCISE_STAGE } from '@/helpers/constants';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'applicationRecords';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      let firestoreRef = query(
        collectionRef,
        where('exercise.id', '==', params.exerciseId),
        where('active', '==', true),
        where('status', '!=', 'withdrawn')
      );

      if (params.where.length === 0) {
        // TODO this should use stages for the correct processing version
        firestoreRef = query(firestoreRef, where('stage', 'in', [
          // v2
          EXERCISE_STAGE.SHORTLISTING,
          EXERCISE_STAGE.SELECTION,
          EXERCISE_STAGE.SCC,
          EXERCISE_STAGE.RECOMMENDATION,
          // v1
          EXERCISE_STAGE.SHORTLISTED,
          EXERCISE_STAGE.SELECTABLE,
          EXERCISE_STAGE.SELECTED,
          EXERCISE_STAGE.RECOMMENDED,
          EXERCISE_STAGE.HANDOVER,
        ]));
      }
      if (params.requested === true) {
        firestoreRef = query(firestoreRef, where('characterChecks.status', '==', 'requested'));
        firestoreRef = tableQuery(state.checksRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('checksRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
      if (params.requested === false) {
        firestoreRef = query(firestoreRef, where('characterChecks.status', '==', 'not requested'));
        firestoreRef = tableQuery(state.checksNotRequestedRecords, firestoreRef, params);
        return bindFirestoreRef('checksNotRequestedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
      if (params.completed === true) {
        firestoreRef = query(firestoreRef, where('characterChecks.status', '==', 'completed'));
        firestoreRef = tableQuery(state.checksCompletedRecords, firestoreRef, params);
        return bindFirestoreRef('checksCompletedRecords', firestoreRef, { serialize: vuexfireSerialize });
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('checksRequestedRecords');
      unbindFirestoreRef('checksNotRequestedRecords');
      unbindFirestoreRef('checksCompletedRecords');
      return true;
    }),
    updateStatus: async ( context, { selectedItems, newStatus } ) => {
      let field = '';
      const existingStatus = 'requested';

      if (newStatus === 'requested') {
        field = 'characterChecks.requestedAt';
      }
      if (newStatus === 'reminder sent') {
        field = 'characterChecks.reminderSentAt';
      }

      const data = {
        'characterChecks.status': existingStatus,
        [field]: serverTimestamp(),
      };

      const batch = writeBatch(firestore);
      selectedItems.map(item => {
        const ref = doc(collectionRef, item);
        batch.update(ref, data);
      });
      await batch.commit();
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    checksRequestedRecords: [],
    checksNotRequestedRecords: [],
    checksCompletedRecords: [],
  },
};
