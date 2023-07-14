import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { functions } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';
import { getExerciseSaveData } from '@/helpers/exerciseHelper';

const collection = firestore.collection('exercises');

export default {
  namespaced: true,
  mutations: {
    setNoOfTestApplications(state, noOfTestApplications) {
      state.noOfTestApplications = noOfTestApplications;
    },
    setRecord(state, record) {
      state.record = record;
    },
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    getDocumentData: async (context, id) => {
      const docRef = await collection.doc(id).get();
      return docRef.data();
    },
    getDocumentDataByReferenceNumber: async (context, referenceNumber) => {
      let exercise = null;
      const snap = await collection.where('referenceNumber', '==', referenceNumber).limit(1).get();
      if (snap.empty) return null;

      snap.forEach(doc => {
        const row = doc.data();
        row.id = doc.id;
        exercise = row;
      });
      return exercise;
    },
    create: async ({ rootState, dispatch }, data) => {
      const metaRef = firestore.collection('meta').doc('stats');
      return firestore.runTransaction((transaction) => {
        return transaction.get(metaRef).then((metaDoc) => {
          const newExercisesCount = metaDoc.data().exercisesCount + 1;
          const exerciseRef = firestore.collection('exercises').doc();
          transaction.update(metaRef, { exercisesCount: newExercisesCount });
          data.referenceNumber = `JAC${  (100000 + newExercisesCount).toString().substr(1)}`;
          data.progress = data.progress || { started: true };
          data.state = 'draft';
          data.published = false;
          data._applicationVersion = 2;
          data.favouriteOf = firebase.firestore.FieldValue.arrayUnion(rootState.auth.currentUser.uid);
          data.createdBy = rootState.auth.currentUser.uid;
          data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          transaction.set(exerciseRef, getExerciseSaveData(data, data));
          return exerciseRef.id;
        });
      }).then((newId) => {
        return dispatch('bind', newId);
      });
    },
    override: async (_, { exerciseId, data }) => {
      await collection.doc(exerciseId).update(data);
    },
    save: async ({ state }, data) => {
      await collection.doc(state.record.id).update(getExerciseSaveData(state.record, data));
    },
    updateApprovalProcess: async ({ state }, { userId, userName, decision, rejectionReason, rejectionResponse }) => {
      const data = {};
      const user = {
        id: userId,
        name: userName,
      };
      data['_approval.status'] = decision;
      data[`_approval.${decision}`] = {};
      data[`_approval.${decision}.date`] = firebase.firestore.FieldValue.serverTimestamp();
      data[`_approval.${decision}.user`] = user;
      switch (decision) {
        case 'approved':
          data['_approval.rejected'] = null;
          data['state'] = 'approved';
        break;
        case 'rejected':
          data['_approval.approved'] = null;
          data['_approval.rejected.message'] = rejectionReason;
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
      const ref = collection.doc(id);
      await ref.update(data);
    },
    isReadyForTest: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        testingState: null,
      };
      await ref.update(data);
    },
    testing: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        testingState: 'testing',
      };
      await ref.update(data);
    },
    tested: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        testingState: 'tested',
      };
      await ref.update(data);
    },
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: 'draft',
        published: false,
        testingState: null,
        _approval: null,
      };
      await ref.update(data);
    },
    publish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: true,
      };
      await ref.update(data);
    },
    unpublish: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        published: false,
        testingState: null,
      };
      await ref.update(data);
    },
    unarchive: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        state: state.record.hasOwnProperty('stateBeforeArchive') ? state.record.stateBeforeArchive : 'ready',
        stateBeforeArchive: null,
      };
      await ref.update(data);
    },
    archive: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
          state: 'archived',
          stateBeforeArchive: state.record.state,
        };
      await ref.update(data);
    },
    addToFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayUnion(userId),
      };
      await ref.update(data);
    },
    removeFromFavourites: async ({ state }, userId) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        favouriteOf: firebase.firestore.FieldValue.arrayRemove(userId),
      };
      await ref.update(data);
    },
    refreshApplicationCounts: async ({ state }) => {
      if (state.record) {
        await functions.httpsCallable('refreshApplicationCounts')({ exerciseId: state.record.id });
      }
    },
    createTestApplications: async ({ state }, noOfTestApplications) => {
      const exercise = state.record;
      await functions.httpsCallable('createTestApplications')({ exerciseId: exercise.id, noOfTestApplications });
    },
    changeNoOfTestApplications({ commit }, noOfTestApplications) {
      commit('setNoOfTestApplications', noOfTestApplications);
    },
    delete: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      await ref.delete();
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
      // Used to facilitate different fields after 01-04-2023
      return state.record.applicationOpenDate > new Date('2023-04-01');
    },
  },
};
