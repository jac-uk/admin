// import firebase from '@firebase/app';
// import { firestore } from '@/firebase';
// import { firestoreAction } from 'vuexfire';
// import vuexfireSerialize from '@/helpers/vuexfireSerialize';

// const collection = firestore.collection('applicationRecords');

export default {
  namespaced: true,
  state: {
    applicationRecords: [
      {
        id: 'application1',
        candidate: {
          fullName: 'Jimmy Jones',
        },
      },
      {
        id: 'application2',
        candidate: {
          fullName: 'Benny Bojangles',
        },
      },
    ],
  },
  getters: {
    availableStatuses() {
      return [
        { ref: 'passedSift', title: 'Passed Sift' },
        { ref: 'failedSift', title: 'Failed Sift' },
      ];
    },
  },
  // actions: {
  //   bind: firestoreAction(({ bindFirestoreRef }, { exerciseId }) => {
  //     let firestoreRef = collection
  //       .where('exerciseId', '==', exerciseId)
  //       .where('stage', '==', EXERCISE_STAGE.REVIEW);
  //     return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
  //   }),
  //   unbind: firestoreAction(({ unbindFirestoreRef }) => {
  //     return unbindFirestoreRef('records');
  //   }),
  //   updateStatus: async (applicationId, status) => {
  //     // @TODO work out whether stage should also be updated
  //     const data = {
  //       status: status,
  //       stage: EXERCISE_STAGE.SELECTED,  
  //     };
  //     const ref = collection.doc(applicationId);
  //     await ref.update(data);
  //   },
  // },
};
