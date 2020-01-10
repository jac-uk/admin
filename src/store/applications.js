import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, exerciseId) => {
      const firestoreRef = firestore
        .collection('applications').where('exerciseId', '==', exerciseId);
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
