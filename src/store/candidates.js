import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collection = firestore.collection('candidates');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      const firestoreRef = await tableQuery(state.records, collection, params);
      if (firestoreRef) {
        return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      } else {
        commit('records', []);
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    search: async (context, { searchTerm, exerciseId }) => {
      const results = [];
      if (searchTerm) {
        let query = collection.where('computed.search', 'array-contains', searchTerm.toLowerCase());
        if (exerciseId) {
          query = query.where(`computed.exercisesMap.${exerciseId}`, 'in', ['applied', 'draft', 'withdrawn']);
        }
        const snap = await query.limit(10).get();
        snap.forEach(doc => {
          const row = doc.data();
          row.id = doc.id;
          results.push(row);
        });
      }
      if (results.length) { // only interested in candidate ids
        return results.map(candidate => candidate.id);
      } else {
        return [];
      }
    },
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
      console.log(id);
      console.log(data);
      await ref.set(data, { merge: true });
    },
  },
  mutations: {
    records(state, data) {
      state.records = data;
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
