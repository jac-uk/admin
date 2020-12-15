// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { lookup } from '@jac-uk/jac-kit/filters/filters';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  getters: {
    availableStatuses() {
      return [
        APPLICATION_STATUS.PASSED_SELECTION,
        APPLICATION_STATUS.FAILED_SELECTION,
        APPLICATION_STATUS.PASSED_BUT_NOT_RECOMMENDED,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('stage', '==', EXERCISE_STAGE.SELECTED)
        .where('active', '==', true);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { status, nextStage, empApplied } ) => {
      const moveToNextStage = nextStage !== EXERCISE_STAGE.SELECTED;

      const data = {
        stage: nextStage,
      };

      if (status) {
        data['status'] = status;
      }

      if (empApplied != null){
        data['flags.empApplied'] = empApplied;
      }

      const selectedItems = context.state.selectedItems;
      const batch = firestore.batch();
      selectedItems.map( item => {
        const ref = collectionRef.doc(item);
        batch.update(ref, data);
      });
      await batch.commit();

      let valueMessage = '';
      if (status) {
        valueMessage = `Updated ${selectedItems.length} candidates to '${lookup(status)}'`;
      } else {
        valueMessage = `Updated ${selectedItems.length} candidates`;
      }
      if (moveToNextStage) {
        valueMessage = `${valueMessage} and moved to '${nextStage}'`;
      }
      context.commit('message', valueMessage);
    },
    storeItems: ( context, { items }) => {
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
  },
};

