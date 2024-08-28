// eslint-disable-next-line
import { query, collection, where} from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'panels';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(collectionRef, where('exerciseId', '==', params.exerciseId));
      if (params.type) {
        firestoreRef = query(firestoreRef, where('type', '==', params.type));
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindApplicationsWithoutPanels: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'applicationRecords'),
        where('exercise.id', '==', params.exerciseId),
        where('active', '==', true),
        where(`${params.type}.panelId`, '==', null)
      );
      if (params.hasOwnProperty('stage') && params.stage) {
        firestoreRef = query(firestoreRef, where('stage', '==', params.stage));
      }
      if (params.hasOwnProperty('status') && params.status) {
        firestoreRef = query(firestoreRef, where('status', '==', params.status));
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
