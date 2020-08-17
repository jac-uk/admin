import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('qualifyingTestResponses');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { qualifyingTestId } ) => {
      const firestoreRef = collectionRef
        .where('qualifyingTest.id', '==', qualifyingTestId);

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

