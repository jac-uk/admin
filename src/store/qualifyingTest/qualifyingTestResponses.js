import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('qualifyingTestResponses');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { qualifyingTestId, searchStatus } ) => {

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
  },
  state: {
    records: [],
  },
};

