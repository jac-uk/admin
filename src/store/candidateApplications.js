import { query, doc, collection, writeBatch, where } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'applications';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, params) => {
      const firestoreRef = await tableQuery(state.records, query(collectionRef, where('userId', '==', params.candidateId), params));
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    update: async (context, data ) => {
      const batch = writeBatch(firestore);
        data.forEach( item => {
          const ref = doc(collection(firestore, 'applicationRecords'), item.id);
          batch.update(ref, item.data);
        });
        await batch.commit();
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    records: [],
  },
};
