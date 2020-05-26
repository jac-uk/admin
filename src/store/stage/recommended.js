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
        APPLICATION_STATUS.PASSED_SIFT,
        APPLICATION_STATUS.FAILED_SIFT,
        APPLICATION_STATUS.SUBMITTED_FIRST_TEST,
        APPLICATION_STATUS.FAILED_FIRST_TEST,
        APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST,
        APPLICATION_STATUS.PASSED_FIRST_TEST,
        APPLICATION_STATUS.FAILED_SCENARIO_TEST,
        APPLICATION_STATUS.PASSED_SCENARIO_TEST,
        APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT,
        APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT,
        APPLICATION_STATUS.NO_TEST_SUBMITTED,
        APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.REVIEW)
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
