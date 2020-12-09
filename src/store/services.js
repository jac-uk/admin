import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }) => {
      const firestoreRef = firestore.doc('settings/services');
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    saveNotificationsSettings: async (context, data) => {
      const ref = firestore.doc('settings/services');
      await ref.update({ notifications: data });
    },
    notificationsStart() {
      return firestore.doc('settings/services').update({
        'notifications.isProcessing': true,
      });
    },
    notificationsStop() {
      return firestore.doc('settings/services').update({
        'notifications.isProcessing': false,
      });
    },
  },
  state: {
    record: null,
  },
  getters: {
    getNotificationSettings: (state) => {
      return state.record && state.record.notifications;
    },
  },
};
