import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId, applicationRef }) => {
      let firestoreRef = firestore
        .collection('assessments')
        .where('exercise.id', '==', exerciseId);
      if (applicationRef) {
        firestoreRef = firestoreRef.where('application.referenceNumber', '==', applicationRef);
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
