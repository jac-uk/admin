import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('qualifyingTestResponses');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { qualifyingTestId, searchStatus } ) => {

      // eslint-disable-next-line no-console
      // console.log('bind Qualifying test responseS', qualifyingTestId, searchStatus);
      
      const isSeachAdjustment = searchStatus === 'reasonable-adjustments';
      const isSearchStatus = searchStatus !== 'all' && !isSeachAdjustment && searchStatus !== '';

      // eslint-disable-next-line prefer-const
      let firestoreRef = collectionRef
        .where('qualifyingTest.id', '==', qualifyingTestId);

      if (isSearchStatus) {
        firestoreRef = firestoreRef
          .where('status', '==', searchStatus);
      }

      if (isSeachAdjustment) {
        firestoreRef = firestoreRef
          .where('candidate.reasonableAdjustments', '==', true);
      }

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindRecord: firestoreAction(({ bindFirestoreRef }, { id } ) => {

      // eslint-disable-next-line no-console
      // console.log('bind Qualifying test response', id);

      const firestoreRef = collectionRef
        .where('application.id', '==', id);

      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindRecord: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }), 
    updateRA: async (context, { data, id }) => {
      // Update Reasonable Adjustments
      const ref = collectionRef.doc(`${id}`);
      await ref.update(data);
    },
  },
  state: {
    records: [],
    record: null,
  },
};

