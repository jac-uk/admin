import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
// import { taskNextStatus } from '@/helpers/exerciseHelper';

// TODO delete this. it is not being used!

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId, type }) => {
      console.log('bind task', `exercises/${exerciseId}/tasks/${type}`);
      const firestoreRef = firestore.doc(`exercises/${exerciseId}/tasks/${type}`);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    update: async (context, { exerciseId, type, data }) => {
      const ref = firestore.doc(`exercises/${exerciseId}/tasks/${type}`);
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.update(data);
    },
    // progressTask: async ({ state }) => {
    //   const id = state.record.id;
    //   const ref = collection.doc(id);
    //   const currentStatus = state.record.status;
    //   const nextStatus = taskNextStatus(currentStatus);
    //   const saveData = {};
    //   if (nextStatus !== currentStatus) {
    //     saveData['status'] = nextStatus;
    //     saveData[`statusLog.${nextStatus}`] = firebase.firestore.FieldValue.serverTimestamp();
    //     await ref.update(saveData);
    //   }
    //   return nextStatus;
    // },
  },
  state: {
    record: null,
  },
};
