// eslint-disable-next-line
import { collection } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionRef = collection(firestore, 'bugReports');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collectionRef;
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
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
  getters: { },
};
