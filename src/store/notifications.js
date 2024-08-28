import { query, collection, where } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bindQueue: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'notifications'),
        where('status', 'in', ['ready', 'failed'])
      );
      firestoreRef = tableQuery(state.queue, firestoreRef, params);
      return bindFirestoreRef('queue', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindQueue: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('queue');
    }),
    bindSent: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'notifications'),
        where('status', '==', 'sent')
      );
      firestoreRef = tableQuery(state.queue, firestoreRef, params);
      return bindFirestoreRef('sent', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindSent: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('sent');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    queue: [],
    sent: [],
  },
};
