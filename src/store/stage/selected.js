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
      return [
        APPLICATION_STATUS.PASSED_SELECTION,
        APPLICATION_STATUS.FAILED_SELECTION,
        APPLICATION_STATUS.PASSED_BUT_NOT_RECOMMENDED,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.SELECTED)
        .where('active', '==', true);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { applicationId, status } ) => {
      let stageValue = EXERCISE_STAGE.SELECTED; // initial value: 'selected'

      if (status === APPLICATION_STATUS.PASSED_SELECTION) {
        stageValue = EXERCISE_STAGE.RECOMMENDED;
      }

      const data = {
        status: status,
        stage: stageValue,
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
