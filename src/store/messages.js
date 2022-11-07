import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collection = firestore.collection('messages');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef }, { type }) => {
      let firestoreRef = collection;
      if (type) {
        firestoreRef = firestoreRef.where('type', '==', type);
      }
      if (firestoreRef) {
        await bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      }
      return;
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    save: async (context, { data, id }) => {
      const isUpdate = id ? true : false;
      if (isUpdate) {
        data.lastUpdatedBy = {
          userId: context.rootState.auth.currentUser.uid,
          displayName: context.rootState.auth.currentUser.displayName,
          date: firebase.firestore.FieldValue.serverTimestamp(),
        };
      } else {
        data.createdBy = {
          userId: context.rootState.auth.currentUser.uid,
          displayName: context.rootState.auth.currentUser.displayName,
          date: firebase.firestore.FieldValue.serverTimestamp(),
        };
      }

      if (isUpdate) {
        return await collection.doc(id).update(data);
      } else {
        return await collection.add(data);
      }
    },
    delete: async (context, { id }) => {
      const ref = firestore
        .collection('notes').doc(id);
      await ref.delete();
    },
  },
  state: {
    records: [],
  },
};
