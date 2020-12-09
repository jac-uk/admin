import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collection = firestore.collection('notes');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef }, { candidateId, applicationId }) => {
      let firestoreRef = collection;
      if (candidateId) {
        firestoreRef = firestoreRef
          .where('candidate.id', '==', candidateId)
          .orderBy('created', 'desc');
      }
      if (applicationId) {
        firestoreRef = firestoreRef.where('applicationId', '==', applicationId);
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
        };
      } else {
        data.createdBy = {
          userId: context.rootState.auth.currentUser.uid,
          displayName: context.rootState.auth.currentUser.displayName,
        };
      }

      if (isUpdate) {
        await collection.doc(id).update(data);
      } else {
        await collection.add(data);
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
