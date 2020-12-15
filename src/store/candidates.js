import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collection = firestore.collection('candidates');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      const firestoreRef = tableQuery(state.records, collection, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    // @TODO tidy up these binds
    bindDoc: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
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
    record: null,
    characterInformation: null,
    equalityAndDiversitySurvey: null,
    personalDetails: null,
  },
};
