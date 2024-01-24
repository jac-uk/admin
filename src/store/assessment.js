import { query, where, getDocs, collection, doc, updateDoc, setDoc, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import clone from 'clone';

const collectionName = 'assessments';
const collectionRef = collection(firestore, collectionName);

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
    save: async ({ state }, data) => {
      if (data.id == null && state.record == null){
        throw 'State null and no ID passed';
      }
      if (!data.submittedDate){
        data.submittedDate = serverTimestamp();
      }
      data.updatedDate = serverTimestamp();
      let docId;
      state.record == null ? docId = data.id : docId = state.record.id;
      const ref = doc(collectionRef, docId);
      return await setDoc(ref, data, { merge: true });
    },
    delete: async (context, { id }) => {
      const data = {
        status: STATUS.DELETED,
      };

      const queryRef = query(collectionRef, where('application.id', '==', id));
      const snapshot = getDocs(queryRef);
      snapshot.forEach(async doc => {
        await updateDoc(doc(collectionRef, doc.id), data);
      });

      return queryRef;
    },
    update: async (context, { data, AssessorNr, id }) => {
      let returnData = {};
      if (AssessorNr == 1) {
        returnData = {
          assessor: {
            email: data.firstAssessorEmail,
            fullName: data.firstAssessorFullName,
          },
        };
      } else if (AssessorNr == 2) {
        returnData = {
          assessor: {
            email: data.secondAssessorEmail,
            fullName: data.secondAssessorFullName,
          },
        };
      }

      const ref = doc(collectionRef, `${id}-${AssessorNr}`);
      const docSnapshot = await ref.get();
      if (docSnapshot.exists) {
         await setDoc(ref, returnData, { merge: true });
      }
      return true;
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
