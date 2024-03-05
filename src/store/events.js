import { collection } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bindInfo: firestoreAction(({ bindFirestoreRef, state }, params) => {
      const firestoreRef = tableQuery(state.info, collection(firestore, 'logs/info/events'), params);
      return bindFirestoreRef('info', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindInfo: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('info');
    }),
    bindWarnings: firestoreAction(({ bindFirestoreRef, state }, params) => {
      const firestoreRef = tableQuery(state.warnings, collection(firestore, 'logs/warnings/events'), params);
      return bindFirestoreRef('warnings', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindWarnings: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('warnings');
    }),
    bindErrors: firestoreAction(({ bindFirestoreRef, state }, params) => {
      const firestoreRef = tableQuery(state.errors, collection(firestore, 'logs/errors/events'), params);
      return bindFirestoreRef('errors', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindErrors: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('errors');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    info: [],
    warnings: [],
    errors: [],
  },
};
