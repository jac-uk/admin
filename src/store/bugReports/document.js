import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collection = firestore.collection('bugReports');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async ({ rootState, dispatch }, data) => {
      const metaRef = firestore.collection('meta').doc('stats');
      return firestore.runTransaction((transaction) => {
        return transaction.get(metaRef).then((metaDoc) => {

          const currentBugsReportCount = metaDoc.data().bugReportsCount;
          let newBugReportsCount;
          if (currentBugsReportCount === undefined) {
            newBugReportsCount = 1;
          }
          else {
            newBugReportsCount = currentBugsReportCount + 1;
          }
          transaction.set(metaRef, {
            bugReportsCount: newBugReportsCount,
          }, { merge: true });

          data.referenceNumber = `BR_${  (1000000 + newBugReportsCount).toString().substr(1)}`;
          data.createdBy = rootState.auth.currentUser.uid;
          const ts = firebase.firestore.FieldValue.serverTimestamp();
          data.createdAt = ts;
          data.lastUpdatedAt = ts;

          const bugReportsRef = firestore.collection('bugReports').doc();

          transaction.set(bugReportsRef, data);
          return bugReportsRef.id;
        });
      }).then((newId) => {
        return dispatch('bind', newId);
      });
    },
    update: async (context, { data, id }) => {
      const ref = collection.doc(id);
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.set(data, { merge: true });
    },
    delete: async (context, id) => {
      await collection.doc(id).delete();
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    record: null,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;
      return state.record.id;
    },
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
