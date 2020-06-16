import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collection = firestore.collection('candidates');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      let firestoreRef = collection
        .orderBy('created', 'desc')
        .limit(100);
      if (id) {
        firestoreRef = collection.doc(id);
      } 
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindDocs: firestoreAction(async ({ bindFirestoreRef }, id) => {
      await bindFirestoreRef('personalDetails', collection.doc(`${id}/documents/personalDetails`), { serialize: vuexfireSerialize });
      await bindFirestoreRef('characterInformation', collection.doc(id).collection('documents').doc('characterInformation'), { serialize: vuexfireSerialize });
      await bindFirestoreRef('equalityAndDiversitySurvey', collection.doc(id).collection('documents').doc('equalityAndDiversitySurvey'), { serialize: vuexfireSerialize });
      return;
    }),
    unbindDocs: firestoreAction(async ({ unbindFirestoreRef }) => {
      await unbindFirestoreRef('personalDetails');
      await unbindFirestoreRef('characterInformation');
      await unbindFirestoreRef('equalityAndDiversitySurvey');
      return;
    }),
    savePersonalDetails: async (context, { data, id }) => {
      const ref = collection.doc(`${id}/documents/personalDetails`);
      await ref.update(data);
    },
    bindNotes: firestoreAction(async ({ bindFirestoreRef }, { candidateId, id }) => {
      let firestoreRef;
      if (id) {
        firestoreRef = firestore.collection('notes').doc(id);
      } else {
        firestoreRef = firestore.collection('notes')
          .where('candidate.id', '==', candidateId)
          .orderBy('created', 'desc');
      }
      
      await bindFirestoreRef('notes', firestoreRef, { serialize: vuexfireSerialize });
      return;
    }),
    savePersonalNotes: async (context, { data, id }) => {
      const isUpdate = (() => id ? true : false)();
      if (isUpdate) {
        data.lastUpdatedBy = {
          userId: context.rootState.auth.currentUser.uid,
          displayName: context.rootState.auth.currentUser.displayName,
        };
      } else {
        data.createdBy = {
          userId: context.rootState.auth.currentUser.uid,
          displayName: context.rootState.auth.currentUser.displayName,
        };
      }

      const ref = firestore.collection('notes');
      if (isUpdate) {
        ref.where('id', '==', id);
        await ref.update(data);
      } else {
        await ref.add(data);
      }      
    },
    deletePersonalNotes: async (context, { id }) => {
      const data = {};
      const ref = firestore
        .collection('notes').doc(id);
      // eslint-disable-next-line
      console.log('deletePersonalNotes ref', ref);
      await ref.update(data);
    },
  },
  state: {
    records: [],
    characterInformation: null,
    equalityAndDiversitySurvey: null,
    personalDetails: null,
    notes: null,
  },
};
