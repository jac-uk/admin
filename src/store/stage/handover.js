// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import { EXERCISE_STAGE } from '@/helpers/constants';

const collectionRef = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId } ) => {
      const firestoreRef = collectionRef
        .where('exercise.id', '==', exerciseId)
        .where('stage', '==', EXERCISE_STAGE.HANDOVER)
        .where('active', '==', true);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { nextStage } ) => {
      const data = {
        stage: nextStage,
      };
      
      const selectedItems = context.state.selectedItems;
      const batch = firestore.batch();
      selectedItems.map( item => {
        const ref = collectionRef.doc(item);
        batch.update(ref, data);
      });
      await batch.commit();

      let valueMessage = `Updated ${selectedItems.length} candidates`; 
      valueMessage = `${valueMessage} and moved to '${nextStage}'`;
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
