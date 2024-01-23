// TODO: KO upgrade to modular API
// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionRef = firestore.collection('panels');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = collectionRef.where('exerciseId', '==', params.exerciseId);
      if (params.type) {
        firestoreRef = firestoreRef.where('type', '==', params.type);
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindApplicationsWithoutPanels: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore.collection('applicationRecords')
        .where('exercise.id', '==', params.exerciseId)
        .where('active', '==', true)
        .where(`${params.type}.panelId`, '==', null);
      if (params.hasOwnProperty('stage') && params.stage) {
        firestoreRef = firestoreRef.where('stage', '==', params.stage);
      }
      if (params.hasOwnProperty('status') && params.status) {
        firestoreRef = firestoreRef.where('status', '==', params.status);
      }
      firestoreRef = tableQuery(state.applicationsWithoutPanels, firestoreRef, params);
      return bindFirestoreRef('applicationsWithoutPanels', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindApplicationsWithoutPanels: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('applicationsWithoutPanels');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    records: [],
    applicationsWithoutPanels: [],
  },
  getters: { },
};
