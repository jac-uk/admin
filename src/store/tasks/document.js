import { doc, updateDoc, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId, type }) => {
      const firestoreRef = doc(firestore, `exercises/${exerciseId}/tasks/${type}`);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    update: async (context, { exerciseId, type, data }) => {
      const ref = doc(firestore, `exercises/${exerciseId}/tasks/${type}`);
      data.lastUpdated = serverTimestamp();
      await updateDoc(ref, data);
    },
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
