// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '../../helpers/constants';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  getters: {
    availableStatuses() {
      // @TODO conditional selection based on Exercise type
      return [
        APPLICATION_STATUS.REJECTED_BY_CHARACTER,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
        APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
        APPLICATION_STATUS.SCC_TO_RECONSIDER,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.RECOMMENDED)
        .where('active', '==', true);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { applicationId, status } ) => {
      // @TODO based on provided status, work out whether stage should also be updated
      const data = {
        status: status,
        // stage: stageValue,
      };
      const ref = collectionRef.doc(applicationId);
      await ref.update(data);
      // @TODO store message(s) for what's been updated so it/they can be retrieved later (on list page)
    },
  },
  state: {
    records: [],
  },
};
