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
        APPLICATION_STATUS.INVITED_TO_SELECTION_DAY,
        APPLICATION_STATUS.REJECTED_AS_INELIGIBLE,
        APPLICATION_STATUS.WITHDREW_APPLICATION,
      ];
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.SHORTLISTED)
        .where('active', '==', true)
        .limit(50);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { status, empVal } ) => {
      let stageValue = EXERCISE_STAGE.SHORTLISTED; // initial value: 'shortlisted'
      const moveToNextStage = (status === APPLICATION_STATUS.INVITED_TO_SELECTION_DAY);

      if (moveToNextStage) {
        stageValue = EXERCISE_STAGE.SELECTED;
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
