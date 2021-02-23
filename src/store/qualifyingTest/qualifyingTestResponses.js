import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';
import { QUALIFYING_TEST, QUALIFYING_TEST_RESPONSE } from '@jac-uk/jac-kit/helpers/constants';
import { authorisedToPerformAction } from '@/helpers/authUsers';

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
      await context.dispatch('update', { data: data, id: id });
    },
    delete: (context, { id }) => {
      const batch = firestore.batch();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        status: QUALIFYING_TEST_RESPONSE.STATUS.DELETED,
        lastUpdated: timestamp,
        statusLog: {
          'deleted': timestamp,
        },
      };
      // eslint-disable-next-line no-unused-vars
      const collection = firestore.collection('qualifyingTestResponses')
        .where('application.id', '==', id)
        .get()
        .then(async snapshot => {
          snapshot.forEach(response => {
            const ref = firestore.collection('qualifyingTestResponses').doc(response.id);
            batch.set(ref, data, { merge: true } );
          });
          await batch.commit();
        });
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

      const data = {
        qualifyingTest: qtData,
        testQuestions: [],
        status: QUALIFYING_TEST_RESPONSE.STATUS.CREATED,
        responses: qualifyingTestResponse.responses,
        'statusLog.started': null,
        'statusLog.completed': null,
      };

      await context.dispatch('update', { data: data, id: qualifyingTestResponse.id });
    },
    resetTest: async (context) => {
      const email = firebase.auth().currentUser.email;
      const canReset = await authorisedToPerformAction(email);
      if (canReset) {
        const rec = context.state.record;
        const data = {
              'status': 'activated',
            };
        if (rec.isOutOfTime === true) {
          data.isOutOfTime = false;
        }
        await context.dispatch('update', { data: data, id: rec.id });
      }
    },
    markAsCompleted: async (context) => {
      const email = firebase.auth().currentUser.email;
      const canMarkAsCompleted = await authorisedToPerformAction(email);
      if (canMarkAsCompleted) {
        const rec = context.state.record;
        const data = {
          'status': 'completed',
        };
        await context.dispatch('update', { data: data, id: rec.id });
      }
    },
  },
  state: {
    records: [],
    record: null,
  },
};
