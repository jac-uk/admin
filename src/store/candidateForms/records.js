import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state }, { type, ...params }) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('active', '==', true);

      firestoreRef = firestoreRef.where(`${type}.status`, '==', params.status);
      firestoreRef = await tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('records');
      return true;
    }),
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
