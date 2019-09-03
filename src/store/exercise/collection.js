import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }) => {
      const firestoreRef = firestore
        .collection('exercises')
        .orderBy('openAt', 'desc');
      return bindFirestoreRef('records', firestoreRef);
    }),
  },
  state: {
    records: [],
  },
};
