// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '@/helpers/constants';
import { lookup } from '@/filters';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  getters: {
    availableStatuses() {
      return [
        APPLICATION_STATUS.REJECTED_BY_CHARACTER,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
        APPLICATION_STATUS.APPROVED_FOR_FUTURE_APPOINTMENT,
        APPLICATION_STATUS.SCC_TO_RECONSIDER,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.RECOMMENDED)
        .where('active', '==', true)
        .limit(50);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { status, empVal } ) => {
      let stageValue = EXERCISE_STAGE.RECOMMENDED; // initial value: 'recommended'
      const moveToNextStage = (status === APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT);
      
      if (moveToNextStage) {
        stageValue = EXERCISE_STAGE.HANDOVER;
      }

      const data = {
        status: status,
        stage: stageValue,
      };

      if (empVal.shouldUpdate){
        data['flags.empApplied'] = empVal.newStatus;
      }

      const selectedItems = context.state.selectedItems;
      const batch = firestore.batch();
      selectedItems.map( item => {
        const ref = collectionRef.doc(item);
        batch.update(ref, data);
      });
      await batch.commit();
      
      let valueMessage = `Updated ${selectedItems.length} candidates to '${lookup(status)}'`; 
      if (moveToNextStage) {
        valueMessage = `${valueMessage} and moved to '${stageValue}'`;
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
