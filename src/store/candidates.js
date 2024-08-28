import { query, doc, getDocs, limit, collection, setDoc, where } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@jac-uk/jac-kit/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

const collectionName = 'candidates';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      const firestoreRef = await tableQuery(state.records, collectionRef, params);
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
        let queryRef = query(collectionRef, where('computed.search', 'array-contains', searchTerm.toLowerCase()));
        if (exerciseId) {
          queryRef = query(queryRef, where(`computed.exercisesMap.${exerciseId}`, 'in', ['applied', 'draft', 'withdrawn']));
        }
        const snap = await getDocs(query(queryRef, limit(10)));
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
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDoc: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    bindDocs: firestoreAction(async ({ bindFirestoreRef }, id) => {
      await bindFirestoreRef('personalDetails', doc(collectionRef, `${id}/documents/personalDetails`), { serialize: vuexfireSerialize });
      await bindFirestoreRef('characterInformation', doc(collectionRef, id, 'documents', 'characterInformation'), { serialize: vuexfireSerialize });
      await bindFirestoreRef('equalityAndDiversitySurvey', doc(collectionRef, id, 'documents', 'equalityAndDiversitySurvey'), { serialize: vuexfireSerialize });
      return;
    }),
    unbindDocs: firestoreAction(async ({ unbindFirestoreRef }) => {
      await unbindFirestoreRef('personalDetails');
      await unbindFirestoreRef('characterInformation');
      await unbindFirestoreRef('equalityAndDiversitySurvey');
      return;
    }),
    savePersonalDetails: async (context, { data, id }) => {
      const ref = doc(collectionRef, `${id}/documents/personalDetails`);
      await setDoc(ref, data, { merge: true });
    },
    getByEmail: async ({ commit }, email) => {
      const queryRefSnapshot = await getDocs(query(collectionRef, where('email', '==', email)));
      if (!queryRefSnapshot.empty) {
        const candidate = vuexfireSerialize(queryRefSnapshot.docs[0]);
        commit('setRecord', candidate);
      }
    },
    save: async ({ state }, data) => {
      const ref = doc(collectionRef, state.record.id);
      await setDoc(ref, data, { merge: true });
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
    records(state, data) {
      state.records = data;
    },
    setRecord(state, data) {
      state.record = data;
    },
    resetRecord(state) {
      state.record = null;
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
