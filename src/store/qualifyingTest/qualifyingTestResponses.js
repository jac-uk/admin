import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('qualifyingTestResponses');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { qualifyingTestId, searchStatus } ) => {
      // eslint-disable-next-line prefer-const
      let firestoreRef = collectionRef
        .where('qualifyingTest.id', '==', qualifyingTestId);

      if (searchStatus !== 'all' && searchStatus !== '') {
        firestoreRef = firestoreRef
          .where('status', '==', searchStatus);
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

