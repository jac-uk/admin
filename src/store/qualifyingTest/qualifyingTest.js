import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

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
    bindQTs: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collection
        .where('vacancy.id', '==', params.exerciseId);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindQTs: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    create: async (state, data) => {
      data.created = firebase.firestore.FieldValue.serverTimestamp();
      data.status = QUALIFYING_TEST.STATUS.CREATED;
      data.lastUpdated = null;
      data.counts = {};
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
    copy: async (context) => {
      const qualifyingTest = context.state.record;
      const data = context.getters.data();
      data.title += ' copy';
      data.mode = 'mop-up';
      data.relationship = {
        copiedFrom: qualifyingTest.id,
      };
      data.startDate = null;
      data.endDate = null;
      const newId = await context.dispatch('create', data);
      return newId;
    },
    delete: async ({ state }) => {
      await collection.doc(state.record.id).delete();
    },
  },
  state: {
    record: null,
    records: [],
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;
      return state.record.id;
    },
    data: (state) => () => {
      return clone(state.record);
    },
    getById: (state) => (id) => {
      // TODO if we don't have document then get it from firestore
      return state.records.find(item => item.id === id);
    },
    getCompletedQTs: (state) => {
      return state.records.filter(qualifyingTest => {
        return qualifyingTest.status === QUALIFYING_TEST.STATUS.COMPLETED
          && qualifyingTest.mode !== QUALIFYING_TEST.MODE.MOP_UP;
      });
    },
  },
};
