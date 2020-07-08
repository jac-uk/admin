import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collection = firestore.collection('candidates');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      let firestoreRef = collection
        .orderBy('created', 'desc');
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
  },
  state: {
    records: [],
    characterInformation: null,
    equalityAndDiversitySurvey: null,
    personalDetails: null,
  },
};
