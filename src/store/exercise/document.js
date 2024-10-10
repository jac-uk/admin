import { query, doc, collection, getDoc, getDocs, updateDoc, where, limit, runTransaction, serverTimestamp, arrayUnion, arrayRemove } from '@firebase/firestore';
import { httpsCallable } from '@firebase/functions';
import { firestore, functions } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';
import { getExerciseSaveData } from '@/helpers/exerciseHelper';
import { logEvent } from '@/helpers/logEvent';
import { checkNested } from '@/helpersTMP/object';
import { ADVERT_TYPES } from '@/helpers/constants';

const collectionName = 'exercises';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
    setNoOfTestApplications(state, noOfTestApplications) {
      state.noOfTestApplications = noOfTestApplications;
    },
    setRecord(state, record) {
      state.record = record;
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    getDocumentData: async (context, id) => {
      const docSnap = await getDoc(doc(collectionRef, id));
      return docSnap.data();
    },
    getDocumentDataByReferenceNumber: async (context, referenceNumber) => {
      let exercise = null;
      const queryRef = query(collectionRef, where('referenceNumber', '==', referenceNumber), limit(1));
      const snap = await getDocs(queryRef);
      if (snap.empty) return null;

      snap.forEach(doc => {
        const row = doc.data();
        row.id = doc.id;
        exercise = row;
      });
      return exercise;
    },
    create: async ({ rootState, dispatch }, data) => {
      const metaRef = doc(firestore, 'meta', 'stats');

      const newId = await runTransaction(firestore, async (transaction) => {
        const metaDoc = await transaction.get(metaRef);
        const newExercisesCount = metaDoc.data().exercisesCount + 1;
        const exerciseRef = doc(collection(firestore, 'exercises'));

        let prefix = 'JAC';
        if (data.advertType === ADVERT_TYPES.EXTERNAL) {
          prefix = 'EXT';
        } else if (data.isWelshGov) {
          prefix = 'GOW';
        }
        transaction.update(metaRef, { exercisesCount: newExercisesCount });
        data.referenceNumber = `${prefix}${  (100000 + newExercisesCount).toString().substr(1)}`;
        data.progress = data.progress || { started: true };
        data.state = 'draft';
        data.published = false;
        data._applicationVersion = 3;
        data.favouriteOf = arrayUnion(rootState.auth.currentUser.uid);
        data.createdBy = rootState.auth.currentUser.uid;
        data.createdAt = serverTimestamp();

        const ignoreFields = ['_applicationRecords', '_applications', '_approval', 'testingState'];
        for (const key in data) {
          if (ignoreFields.includes(key)) {
            delete data[key];
          }
        }

        transaction.set(exerciseRef, getExerciseSaveData(data, data));
        return exerciseRef.id;
      });

      return await dispatch('bind', newId);
    },
    override: async (_, { exerciseId, data }) => {
      await updateDoc(doc(collectionRef, exerciseId), data);
    },
    save: async ({ state }, data) => {
      await updateDoc(doc(collectionRef, state.record.id), getExerciseSaveData(state.record, data));
    },
    updateApprovalProcess: async ({ state, getters }, { userId, userName, decision, rejectionReason, rejectionResponse }) => {
      const data = {};
      const user = {
        id: userId,
        name: userName,
      };
      data['_approval.status'] = decision;
      data[`_approval.${decision}`] = {};
      data[`_approval.${decision}.date`] = serverTimestamp();
      data[`_approval.${decision}.user`] = user;
      switch (decision) {
        case 'approved':
          data['_approval.rejected'] = null;
          data['state'] = 'approved';
          if (!getters.hasInitialApprovalDate) {
            data['_approval.initialApprovalDate'] = serverTimestamp();
          }
        break;
        case 'rejected':
          data['_approval.rejected.message'] = rejectionReason;
          data['_approval.rejected.response'] = null;
          data['state'] = 'draft';
        break;
        default:  // 'requested'
          data['_approval.approved'] = null;
          if (rejectionResponse) {
            data['_approval.rejected.response'] = rejectionResponse;
          }
          else {
            data['_approval.rejected'] = null;
          }
          data['state'] = 'ready';
      }
      // Update record
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      await updateDoc(ref, data);
    },
    isReadyForTest: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        testingState: null,
      };
      await updateDoc(ref, data);
    },
    testing: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        testingState: 'testing',
      };
      await updateDoc(ref, data);
    },
    tested: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        testingState: 'tested',
      };
      await updateDoc(ref, data);
    },
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        state: 'draft',
        testingState: null,
      };
      await updateDoc(ref, data);
    },
    publish: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        published: true,
      };
      await updateDoc(ref, data);
    },
    unpublish: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        published: false,
        testingState: null,
      };
      await updateDoc(ref, data);
    },
    unarchive: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        state: state.record.hasOwnProperty('stateBeforeArchive') ? state.record.stateBeforeArchive : 'ready',
        stateBeforeArchive: null,
      };
      await updateDoc(ref, data);
    },
    archive: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
          published: false,   // Unpublish!
          testingState: null,
          state: 'archived',
          stateBeforeArchive: state.record.state,
        };
      await updateDoc(ref, data);
    },
    addToFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        favouriteOf: arrayUnion(userId),
      };
      await updateDoc(ref, data);
    },
    removeFromFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        favouriteOf: arrayRemove(userId),
      };
      await updateDoc(ref, data);
    },
    refreshApplicationCounts: async ({ state }) => {
      if (state.record) {
        await httpsCallable(functions, 'refreshApplicationCounts')({ exerciseId: state.record.id });
      }
    },
    createTestApplications: async ({ state }, noOfTestApplications) => {
      const exercise = state.record;
      await httpsCallable(functions, 'createTestApplications')({ exerciseId: exercise.id, noOfTestApplications });
    },
    changeNoOfTestApplications({ commit }, noOfTestApplications) {
      commit('setNoOfTestApplications', noOfTestApplications);
    },
    delete: async ({ state }) => {
      // soft delete exercise
      const loggingData = {
        exerciseIds: [state.record.id],
        exerciseRefs: [state.record.referenceNumber],
      };
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        state: 'deleted',
        stateBeforeDelete: state.record.state,
      };
      await updateDoc(ref, data);
      logEvent('info', 'Exercises deleted', loggingData);
    },
  },
  state: {
    record: null,
    noOfTestApplications: 0,
  },
  getters: {
    id: (state) => {
      if (state.record === null) return null;

      return state.record.id;
    },
    data: (state) => (objectToPopulate) => {
      const data = clone(state.record);
      if (objectToPopulate) {
        Object.keys(objectToPopulate).forEach(key => {
          if (data[key] !== undefined) {
            objectToPopulate[key] = data[key];
          }
        });
        return objectToPopulate;
      } else {
        return data;
      }
    },
    noOfTestApplications: state => state.noOfTestApplications,
    _approval: (state) => {
      if (state.record && state.record.hasOwnProperty('_approval')) {
        return state.record._approval;
      }
      return null;
    },
    applicationOpenDatePost01042023: (state) => {
      const usesPre01042023Questions = ['JAC00130', 'JAC00123', 'JAC00164'].includes(state.record.referenceNumber);
      if (usesPre01042023Questions) {
        return false;
      }
      // Used to facilitate different fields after 01-04-2023
      return state.record.applicationOpenDate > new Date('2023-04-01');
    },
    applicationOpenDatePost15102024: (state, getters, rootState, rootGetters) => {
      const { isDevelop } = rootGetters;
      // hard-coded exercises for testing
      if (isDevelop && ['JAC00010'].includes(state.record.referenceNumber)) {
        return true;
      }
      return state.record.applicationOpenDate > new Date('2024-10-15');
    },
    hasInitialApprovalDate(state) {
      return checkNested(state.record, '_approval', 'initialApprovalDate');
    },
  },
};
