// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { APPLICATION_STATUS } from '@/helpers/constants';
import { lookup } from '@/filters';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('stage', '==', params.stage)
        .where('active', '==', true);
      if (params.status) {
        firestoreRef = firestoreRef.where('status', '==', params.status);
      }
      firestoreRef = await tableQuery(state.records, firestoreRef, params);
      if (firestoreRef) {
        return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      } else {
        commit('records', []);
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async (context, data) => {
      const selectedItems = context.state.selectedItems;
      const saveData = { ...data };
      if (data.stage) {
        saveData[`stageLog.${data.stage}`] = firebase.firestore.FieldValue.serverTimestamp();
      }
      if (data.status) {
        saveData[`statusLog.${data.status}`] = firebase.firestore.FieldValue.serverTimestamp();
      }
      const batch = firestore.batch();
      selectedItems.map(item => {
        const ref = collectionRef.doc(item);
        batch.update(ref, saveData);
      });
      await batch.commit();

      if (data.status === APPLICATION_STATUS.WITHDRAWN) {
        selectedItems.map(async item => {
          await context.dispatch('application/withdraw', { applicationId: item }, { root: true });
        });
      }

      const message = [];
      if (selectedItems.length > 1) {
        message.push(`Updated ${selectedItems.length} candidates`);
      } else {
        message.push(`Updated ${selectedItems.length} candidate`);
      }
      if (data.status) {
        message.push(`to status '${lookup(data.status)}'`);
      }
      if (data.stage) {
        if (message.length > 1) { message.push('and'); }
        message.push(`to stage '${lookup(data.stage)}'`);
      }
      context.commit('message', message.join(' '));
      context.commit('changeSelectedItems', []);

      if (
        data.stage ||
        data.status === APPLICATION_STATUS.WITHDRAWN ||
        data['flags.empApplied'] != null
      ) {
        context.dispatch('exerciseDocument/refreshApplicationCounts', {}, { root: true });
      }

    },
    storeItems: (context, { items }) => {
      context.commit('changeSelectedItems', items);
    },
    getMessages: (context) => {
      const localMsg = context.state.message;
      context.commit('message', null);
      return localMsg;
    },
  },
  state: {
    records: [],
    message: null,
    selectedItems: [],
  },
  mutations: {
    message(state, msg) {
      state.message = msg;
    },
    changeSelectedItems(state, items) {
      state.selectedItems = items;
    },
    records(state, data) {
      state.records = data;
    },
  },
};
