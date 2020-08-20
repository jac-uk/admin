import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import clone from 'clone';
import { QUALIFYING_TEST } from '@/helpers/constants';

const collection = firestore.collection('qualifyingTests');

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
    create: async (state, data) => {
      data.created = firebase.firestore.FieldValue.serverTimestamp();
      data.status = QUALIFYING_TEST.STATUS.CREATED;

      const doc = await collection.add(data);

      return doc.id;
    },
    save: async ({ state }, data) => {
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();

      return await collection.doc(state.record.id).update(data);
    },
    submitForApproval: async ({ state }) => {
      const data = {
        status: QUALIFYING_TEST.STATUS.SUBMITTED,
      };

      await collection.doc(state.record.id).update(data);
    },
    approve: async ({ state }) => {
      const data = {
        status: QUALIFYING_TEST.STATUS.APPROVED,
      };

      await collection.doc(state.record.id).update(data);
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
