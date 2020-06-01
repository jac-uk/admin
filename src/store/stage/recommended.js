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
        .where('active', '==', true);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    updateStatus: async ( context, { applicationId, status } ) => {
      let stageValue = EXERCISE_STAGE.RECOMMENDED; // initial value: 'recommended'

      if (status === APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT) {
        stageValue = EXERCISE_STAGE.HANDOVER;
      }

      const data = {
        status: status,
        stage: stageValue,
      };
      const ref = collectionRef.doc(applicationId);
      await ref.update(data)
      .then(() => {
        const valueMessage = lookup(status); 
        context.commit('message', `Application id #${applicationId} changed to '${valueMessage}'`);
      });
      // @TODO store message(s) for what's been updated so it/they can be retrieved later (on list page)
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
  },
  mutations: {
    message(state, msg) {
      state.message = msg;
    },
  },
};
