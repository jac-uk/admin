import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('applications');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      const firestoreRef = await tableQuery(state.records, collection.where('userId', '==', params.candidateId), params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    update: async (context, data ) => {
      const batch = firestore.batch();
        data.forEach( item => {
          const ref = firestore.collection('applicationRecords').doc(item.id);
          batch.update(ref, item.data);
        });
        await batch.commit();
    },
  },
  state: {
    records: [],
  },
};
