import { collection, doc, runTransaction, serverTimestamp, setDoc, deleteDoc } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

const collectionRef = collection(firestore, 'bugReports');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    create: async ({ rootState, rootGetters, dispatch }, data) => {

      if (!rootGetters.appEnvironment || !import.meta.env.VITE_APP) {
        throw new Error('User feedback has not been activated for this platform/environment');
      }

      const environment = rootGetters.appEnvironment;
      const platform = import.meta.env.VITE_APP;

      const metaRef = doc(collection(firestore, 'meta'), 'stats');
      return runTransaction(firestore, (transaction) => {
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

          const envStr = environment.substring(0, 2);

          data.environment = environment;
          data.platform = platform;

          // Use timestamp for ref no on 'local' to avoid dupe refs being created
          const referenceNumber = (environment === 'LOCAL')
            ? Date.now()
            : (1000000 + newBugReportsCount).toString().substr(1);

          // Reference number consists of the following: BR_<platform>_<2 letter environment>_<timestamp or numerical count>
          data.referenceNumber = `BR_${platform}_${envStr}_${referenceNumber}`.toUpperCase();

          data.createdBy = rootState.auth.currentUser.uid;
          const ts = serverTimestamp();
          data.createdAt = ts;
          data.lastUpdatedAt = ts;

          const bugReportsRef = doc(collection(firestore, 'bugReports'));

          transaction.set(bugReportsRef, data);
          return bugReportsRef.id;
        });
      }).then((newId) => {
        return dispatch('bind', newId);
      });
    },
    update: async (context, { data, id }) => {
      const ref = doc(collectionRef, id);
      data.lastUpdated = serverTimestamp();
      await setDoc(ref, data, { merge: true });
    },
    delete: async (context, id) => {
      await deleteDoc(doc(collectionRef, id));
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
