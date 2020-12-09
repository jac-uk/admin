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
        APPLICATION_STATUS.INVITED_TO_SELECTION_DAY,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', params.exerciseId)
        .where('stage', '==', EXERCISE_STAGE.SHORTLISTED)
        .where('active', '==', true);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { status, nextStage, empApplied } ) => {
      const moveToNextStage = nextStage !== EXERCISE_STAGE.SHORTLISTED;

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

      if (status === APPLICATION_STATUS.WITHDREW_APPLICATION) {
        selectedItems.map( async item => {
          // call withdraw applicationstore
          await context.dispatch('application/withdraw', { applicationId: item }, { root: true });
        });
      }

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
