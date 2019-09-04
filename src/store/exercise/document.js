import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = firestore
        .collection('exercises')
        .doc(id);
      return bindFirestoreRef('record', firestoreRef);
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
  },
  state: {
    record: null,
  },
};
