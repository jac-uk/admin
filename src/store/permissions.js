import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('settings');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }) => {
      const firestoreRef = collection.doc('permissions');
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
  },
  state: {
    record: null,
  },
  getters: {
    allPermissions: (state) => {
      return clone(state.record.permissions);
    },
  },
};
