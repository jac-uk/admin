import { orderBy, query, doc, collection, addDoc, deleteDoc, updateDoc, where } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collectionName = 'notes';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef }, { candidateId, applicationId }) => {
      let firestoreRef = collectionRef;
      if (candidateId) {
        firestoreRef = query(
          firestoreRef,
          where('candidate.id', '==', candidateId),
          orderBy('created', 'desc')
        );
      }
      if (applicationId) {
        firestoreRef = query(firestoreRef, where('applicationId', '==', applicationId));
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
        await updateDoc(doc(collectionRef, id),data);
      } else {
        await addDoc(collectionRef, data);
      }
    },
    delete: async (context, { id }) => {
      const ref = doc(collection(firestore, 'notes'), id);
      await deleteDoc(ref);
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
