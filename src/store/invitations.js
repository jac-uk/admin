// import firebase from '@firebase/app';
// import { firestore } from '@/firebase';
// import { firestoreAction } from 'vuexfire';
// import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import clone from 'clone';

// const collection = firestore.collection('invitations');
  
export default {
  namespaced: true,
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;
      return state.record.id;
    },
    data: () => () => {
      return clone([
        {
          vacancy: {
            id: String,
            title: String,
            referenceNumber: String,
            applicationOpenDate: Date,
            applicationCloseDate: Date,
          },
          candidate: {
            email: 'personone@gmail.com',
            id: 'String', //  <-- populated when candidate accepts/rejects the invitation
          },
          status: 'invited',
          statusLog: {
            invited: new Date(95, 0, 20),
            // accepted: Date, //  <-- populated when candidate accepts the invitation
            // rejected: Date, // <-- populated when candidate rejects the invitation
          },
        },
        {
          vacancy: {
            id: String,
            title: String,
            referenceNumber: String,
            applicationOpenDate: Date,
            applicationCloseDate: Date,
          },
          candidate: {
            email: 'persontwo@gmail.com',
            id: 'String', //  <-- populated when candidate accepts/rejects the invitation
          },
          status: 'accepted',
          statusLog: {
            invited: new Date(95, 0, 20),
            accepted: new Date(2020, 0, 20), //  <-- populated when candidate accepts the invitation
            // rejected: Date, // <-- populated when candidate rejects the invitation
          },
        },
        {
          vacancy: {
            id: String,
            title: String,
            referenceNumber: String,
            applicationOpenDate: Date,
            applicationCloseDate: Date,
          },
          candidate: {
            email: 'personthree@gmail.com',
            id: 'String', //  <-- populated when candidate accepts/rejects the invitation
          },
          status: 'rejected',
          statusLog: {
            invited: new Date(95, 0, 20),
            // accepted: new Date(2020, 0, 20), //  <-- populated when candidate accepts the invitation
            rejected: new Date(2020, 0, 20), // <-- populated when candidate rejects the invitation
          },
        },
      ]);
    },
    //record: (state) => clone(state.record),
  },
};
