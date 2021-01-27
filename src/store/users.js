import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('users');

export default {
  namespaced: true,
  state: {
    records: [],
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, userId) => {
      const firestoreRef = collectionRef
        .where('id', '==', userId);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
  },
};
