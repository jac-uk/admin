// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collectionRef = firestore.collection('panels');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      // eslint-disable-next-line no-console
      // console.log('bind panels', params);
      let firestoreRef = collectionRef
        .where('exerciseId', '==', params.exerciseId)
        .where('type', '==', params.type);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    create: async (context, data ) => {
      // eslint-disable-next-line no-console
      console.log('store create', data);
      await collectionRef.add(data);
    },
  },
  state: {
    records: [],
  },
  mutations: {
    
  },
  getters: {
    getPanel: (state) => (id) => {
      // eslint-disable-next-line no-console
      console.log('getPanel', id, state.records);
      const returnObj = state.records.filter(item => {
        // eslint-disable-next-line no-console
        console.log('filter item', id, item);
        return item.id === id;
      });
      return (returnObj);
    },
  },
};
