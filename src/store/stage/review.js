// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS, SHORTLISTING } from '../../helpers/constants';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  getters: {
    availableStatuses: () => (arrShortlistingMethods, arrOtherShortlistingMethods)  => {
      let arrToReturn = [];

      // telephone-assessment
      if (arrShortlistingMethods.includes(SHORTLISTING.TELEPHONE_ASSESSMENT)) {
        arrToReturn.push(APPLICATION_STATUS.FAILED_TELEPHONE_ASSESSMENT);
        arrToReturn.push(APPLICATION_STATUS.PASSED_TELEPHONE_ASSESSMENT);
      }

      // situational-judgement-qualifying-test || critical-analysis-qualifying-test
      if (
        arrShortlistingMethods.includes(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST) || 
        arrShortlistingMethods.includes(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST)
      ) {
        arrToReturn.push(APPLICATION_STATUS.SUBMITTED_FIRST_TEST);
        arrToReturn.push(APPLICATION_STATUS.FAILED_FIRST_TEST);
        arrToReturn.push(APPLICATION_STATUS.PASSED_FIRST_TEST);
      }

      // scenario-test-qualifying-test
      if (arrShortlistingMethods.includes(SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST)) {
        arrToReturn.push(APPLICATION_STATUS.SUBMITTED_SCENARIO_TEST);
        arrToReturn.push(APPLICATION_STATUS.FAILED_SCENARIO_TEST);
        arrToReturn.push(APPLICATION_STATUS.PASSED_SCENARIO_TEST);
      }

      if (
        arrShortlistingMethods.includes(SHORTLISTING.NAME_BLIND_PAPER_SIFT) || 
        arrShortlistingMethods.includes(SHORTLISTING.PAPER_SIFT)
      ) {
        arrToReturn.push(APPLICATION_STATUS.PASSED_SIFT);
        arrToReturn.push(APPLICATION_STATUS.FAILED_SIFT);
        arrToReturn.push(APPLICATION_STATUS.REJECTED_AS_INELIGIBLE);
      }

      if (
        arrShortlistingMethods.includes(SHORTLISTING.SITUATIONAL_JUDGEMENT_QUALIFYING_TEST) || 
        arrShortlistingMethods.includes(SHORTLISTING.CRITICAL_ANALYSIS_QUALIFYING_TEST) ||
        arrShortlistingMethods.includes(SHORTLISTING.SCENARIO_TEST_QUALIFYING_TEST)
      ) {
        arrToReturn.push(APPLICATION_STATUS.NO_TEST_SUBMITTED);
        arrToReturn.push(APPLICATION_STATUS.TEST_SUBMITTED_OVER_TIME);
      }
      
      // ALL SUBGROUPS
      arrToReturn.push(APPLICATION_STATUS.WITHDREW_APPLICATION);

      // OTHER SHORTLISTING METHODS
      if (arrShortlistingMethods.includes(SHORTLISTING.OTHER)) {
        arrOtherShortlistingMethods.map(item => {
          arrToReturn.push(item.name);
        });
      }

      return arrToReturn;
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
    updateStatus: async ( context, { applicationId, status, nextStage } ) => {
      let stageValue = EXERCISE_STAGE.REVIEW; // initial value: 'review'

      // CHECKBOX SELECTED TO MOVE TO NEXT STAGE: SHORTLISTED
      if (nextStage[0]) {
        stageValue = nextStage[0];
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
