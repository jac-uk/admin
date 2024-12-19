// eslint-disable-next-line
import { writeBatch, query, doc, collection, where, serverTimestamp, getCountFromServer } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { getStageWithdrawalStatus } from '../helpers/exerciseHelper';
import { lookup } from '@/filters';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'applicationRecords';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      let firestoreRef = query(
        collectionRef,
        where('exercise.id', '==', params.exerciseId),
        where('stage', '==', params.stage),
        where('active', '==', true)
      );
      if (params.status) {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
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
        saveData[`stageLog.${data.stage}`] = serverTimestamp();
      }
      if (data.status) {
        saveData[`statusLog.${data.status}`] = serverTimestamp();
      }
      const batch = writeBatch(firestore);
      selectedItems.map(item => {
        const ref = doc(collectionRef, item);
        batch.update(ref, saveData);
      });
      await batch.commit();

      const WITHDRAWAL_STATUS = getStageWithdrawalStatus(context.rootState.exerciseDocument.record);

      if (data.status === WITHDRAWAL_STATUS) {
        selectedItems.map(async item => {
          await context.dispatch('application/withdraw', { applicationId: item }, { root: true });
        });
      }

      const message = [];
      if (selectedItems.length > 1) {
        message.push(`Updated ${selectedItems.length} applications`);
      } else {
        message.push(`Updated ${selectedItems.length} application`);
      }
      if (data.status) {
        message.push(`to status '${lookup(data.status)}'`);
      }
      if (data.stage) {
        if (message.length > 1) { message.push('and'); }
        message.push(`to stage '${lookup(data.stage)}'`);
      }
      context.commit('message', message.join(' '));

      if (
        data.stage ||
        data.status ||
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
    getCount: async (context, params) => {
      let queryRef = query(
        collectionRef,
        where('exercise.id', '==', params.exerciseId),
        where('active', '==', true)
      );
      if (params.status) {
        queryRef = query(queryRef, where('status', '==', params.status));
      }
      const snap = await getCountFromServer(queryRef);
      return snap.data().count;
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
    set(state, { name, value }) {
      state[name] = value;
    },
  },
};
