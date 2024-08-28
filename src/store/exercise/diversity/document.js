import { doc } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, exerciseId) => {
      const firestoreRef = doc(firestore, `exercises/${exerciseId}/data/diversity`);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    record: null,
  },
};
