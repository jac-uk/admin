import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bindQueue: firestoreAction(({ bindFirestoreRef }) => {
      let firestoreRef = firestore
        .collection('notifications')
        .where('status', 'in', ['ready', 'failed'])
        .orderBy('createdAt', 'desc').limit(100);
      return bindFirestoreRef('queue', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindQueue: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('queue');
    }),
    bindSent: firestoreAction(({ bindFirestoreRef }) => {
      let firestoreRef = firestore
        .collection('notifications')
        .where('status', '==', 'sent')
        .orderBy('createdAt', 'desc').limit(100);
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
