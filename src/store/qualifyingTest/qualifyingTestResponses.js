import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import tableQuery from '@/helpers/tableQuery';
import { QUALIFYING_TEST, QUALIFYING_TEST_RESPONSE } from '@/helpers/constants';

const collectionRef = firestore.collection('qualifyingTestResponses');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {

      const isSearchAdjustment = params.searchStatus === 'reasonable-adjustments';
      const isSearchStarted = params.searchStatus === QUALIFYING_TEST.STATUS.STARTED;
      const isSearchInProgress = params.searchStatus === QUALIFYING_TEST.STATUS.PROGRESS;
      const isSearchStatus = params.searchStatus !== 'all' && !isSearchAdjustment && params.searchStatus !== '' && !isSearchStarted && !isSearchInProgress;

      let firestoreRef = collectionRef
        .where('qualifyingTest.id', '==', params.qualifyingTestId);

      if (isSearchStatus) {
        firestoreRef = firestoreRef
          .where('status', '==', params.searchStatus);
      }

      if (isSearchAdjustment) {
        firestoreRef = firestoreRef
          .where('candidate.reasonableAdjustments', '==', true);
      }

      if (isSearchStarted) {
        firestoreRef = firestoreRef
          .where('statusLog.started', '>', new Date('1900-01-01')) // INCLUDE all items with a valid date - not null and not ''
          .orderBy('statusLog.started');
      }

      if (isSearchInProgress) {
        firestoreRef = firestoreRef
          .where('status', '==', QUALIFYING_TEST.STATUS.STARTED);
      }

      firestoreRef = tableQuery(state.records, firestoreRef, params);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindRecord: firestoreAction(({ bindFirestoreRef }, { id } ) => {
      const firestoreRef = collectionRef.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindRecord: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }), 
    create: async (context, { data }) => {
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      return await collectionRef.add(data);
    },
    update: async (context, { data, id }) => {
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      return await collectionRef.doc(id).update(data);
    },
    updateRA: async (context, { data, id }) => {
      // Update Reasonable Adjustments
      await context.dispatch('update', data, id);
    },
    moveTest: async (context, { qualifyingTest, qualifyingTestResponse }) => {
      const qtData = {
        id: qualifyingTest.id,
        type: qualifyingTest.type,
        title: qualifyingTest.title,
        startDate: qualifyingTest.startDate,
        endDate: qualifyingTest.endDate,
        additionalInstructions: qualifyingTest.additionalInstructions,
        feedbackSurvey: qualifyingTest.feedbackSurvey,
      };
      // if response has started then cancel this one and create a new response
      // otherwise move this response to QT
      if (
        qualifyingTestResponse.status === QUALIFYING_TEST_RESPONSE.STATUS.STARTED
        || qualifyingTestResponse.status === QUALIFYING_TEST_RESPONSE.STATUS.COMPLETED
      ) {
        await context.dispatch('update', { data: { status: QUALIFYING_TEST_RESPONSE.STATUS.CANCELLED }, id: qualifyingTestResponse.id });
        const data = qualifyingTestResponse;
        data.qualifyingTest = qtData;
        data.status = QUALIFYING_TEST_RESPONSE.STATUS.CREATED;
        data.testQuestions = {};
        await context.dispatch('create', { data: data });
      } else {
        const data = {
          qualifyingTest: qtData,
        };
        if (qualifyingTest.status === QUALIFYING_TEST.STATUS.ACTIVATED) {
          data.status = QUALIFYING_TEST_RESPONSE.STATUS.ACTIVATED;
          data.testQuestions = qualifyingTest.testQuestions;
        } else {
          data.status = QUALIFYING_TEST_RESPONSE.STATUS.CREATED;
          data.testQuestions = {};
        }
        await context.dispatch('update', { data: data, id: qualifyingTestResponse.id });
      }
    },
  },
  state: {
    records: [],
    record: null,
  },
};

