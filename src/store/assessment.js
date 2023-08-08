import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import clone from 'clone';

const collection = firestore.collection('assessments');

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
    save: async ({ state }, data) => {
      if (data.id == null && state.record == null){
        throw 'State null and no ID passed';
      }
      if (!data.submittedDate){
        data.submittedDate = firebase.firestore.FieldValue.serverTimestamp();
      }
      data.updatedDate = firebase.firestore.FieldValue.serverTimestamp();
      let docId;
      state.record == null ? docId = data.id : docId = state.record.id;
      const ref = collection.doc(docId);
      return await ref.set(data, { merge: true });
    },
    delete: (context, { id }) => {
      const data = {
        status: STATUS.DELETED,
      };
      const collectionRef = collection
        .where('application.id', '==', id)
        .get()
        .then(snapshot => {
          snapshot.forEach(async doc => {
            await collection.doc(doc.id).update(data);
          });
        });
      return collectionRef;
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

      const ref = collection.doc(`${id}-${AssessorNr}`);
      await ref.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            ref.set(returnData, { merge: true });
          }
        });
      return true;
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
