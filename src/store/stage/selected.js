// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE, APPLICATION_STATUS } from '../../helpers/constants';
import { lookup } from '@/filters';

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
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      let firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.SELECTED)
        .where('active', '==', true)
        .limit(50);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { status } ) => {
      let stageValue = EXERCISE_STAGE.SELECTED; // initial value: 'selected'

      if (status === APPLICATION_STATUS.PASSED_SELECTION) {
        stageValue = EXERCISE_STAGE.RECOMMENDED;
      }

      const data = {
        status: status,
        stage: stageValue,
      };
      const selectedItems = context.state.selectedItems;
      const batch = firestore.batch();
      selectedItems.map( item => {
        const ref = collectionRef.doc(item);
        batch.update(ref, data);
      });
      await batch.commit();
      
      const valueMessage = lookup(status); 
      context.commit('message', `Updated ${selectedItems.length} candidates to '${valueMessage}'`);
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

