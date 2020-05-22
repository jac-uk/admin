// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '../../helpers/constants';

const localCollection = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  getters: {
    availableStatuses() {
      return [
        { ref: APPLICATION_STATUS.PASSED_SIFT, title: 'Passed Sift' },
        { ref: APPLICATION_STATUS.FAILED_SIFT, title: 'Failed Sift' },
        { ref: APPLICATION_STATUS.SUBMITTED_FIRST_TEST, title: 'Submitted first test' },
        { ref: APPLICATION_STATUS.FAILED_FIRST_TEST, title: 'Failed First test' },
        { ref: APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST, title: 'Submitted scenario test' },
        { ref: APPLICATION_STATUS.PASSED_FIRST_TEST, title: 'Passed first test' },
        { ref: APPLICATION_STATUS.FAILED_SCENARIO_TEST, title: 'Failed scenario test' },
        { ref: APPLICATION_STATUS.PASSED_SCENARIO_TEST, title: 'Passed scenario test' },
        { ref: APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT, title: 'Failed telephone assessment' },
        { ref: APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT, title: 'Passed telephone assessment' },
        { ref: APPLICATION_STATUS.NO_TEST_SUBMITTED, title: 'No test Submitted' },
        { ref: APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME, title: 'Test submitted over time' },
        { ref: APPLICATION_STATUS.WITHDREW_APPLICATION, title: 'Withdrew application' },
        { ref: APPLICATION_STATUS.REJECTED_AS_INELIGIBLE, title: 'Rejected asineligible' },
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, exerciseId ) => {
      // eslint-disable-next-line
      console.log('exerciseId', exerciseId);
      let firestoreRef = localCollection
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.REVIEW)
        .where('active', '==', true);

      console.log('firestoreRef', firestoreRef);
      return bindFirestoreRef('applicationRecords', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('applicationRecords');
    }),
    updateStatus: async (applicationId, status, stageValue) => {
      // @TODO work out whether stage should also be updated
      const data = {
        status: status,
        stage: stageValue,
      };
      const ref = localCollection.doc(applicationId);
      await ref.update(data);
    },
  },
  state: {
    applicationRecords: [],
  },
};
