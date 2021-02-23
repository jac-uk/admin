import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collection = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { candidateId }) => {
      const firestoreRef = collection
        .where('candidate.id', '==', candidateId);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    update: async (context, data ) => {
      const batch = firestore.batch();
        data.forEach( item => {
          const ref = collection.doc(item.id);
          batch.update(ref, item.data);
        });
        await batch.commit();
    },
  },
  state: {
    records: [],
  },
};
