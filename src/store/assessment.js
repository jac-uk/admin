import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('assessments');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);

      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    save: async ({ state }, data) => {
      if (data.id == null && state.record == null){
        throw 'State null and no ID passed';
      }
      let docId;
      state.record == null ? docId = data.id : docId = state.record.id;
      const ref = collection.doc(docId);
      return await ref.set(data, { merge: true });
    },
    delete: (context, { data, id }) => {
      const collectionRef = collection
        .where('application.id', '==', id)
        .get()
        .then(snapshot => {
          snapshot.forEach(async doc => {
            await collection.doc(doc.id).update(data);
          });
        });
      return collectionRef;
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;

      return state.record.id;
    },
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
