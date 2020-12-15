import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

export default {
  namespaced: true,
  actions: {
    bindQueue: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore
        .collection('notifications')
        .where('status', 'in', ['ready', 'failed']);
      firestoreRef = tableQuery(state.queue, firestoreRef, params);
      return bindFirestoreRef('queue', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindQueue: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('queue');
    }),
    bindSent: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore
        .collection('notifications')
        .where('status', '==', 'sent');
      firestoreRef = tableQuery(state.queue, firestoreRef, params);
      return bindFirestoreRef('sent', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindSent: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('sent');
    }),
  },
  state: {
    queue: [],
    sent: [],
  },
};
