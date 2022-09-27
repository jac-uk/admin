import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

// TODO delete this. it is not being used!

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId, type }) => {
      const firestoreRef = firestore.doc(`exercises/${exerciseId}/tasks/${type}`);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    update: async (context, { exerciseId, type, data }) => {
      const ref = firestore.doc(`exercises/${exerciseId}/tasks/${type}`);
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.update(data);
    },
  },
  state: {
    record: null,
  },
};
