import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import clone from 'clone';

const collection = firestore.collection('panels');

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
    bindApplications: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore.collection('applicationRecords')
        .where('exercise.id', '==', params.exerciseId)
        .where(`${params.type}.panelId`, '==', params.panelId);
      firestoreRef = tableQuery(state.applications, firestoreRef, params);
      return bindFirestoreRef('applications', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindApplications: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('applications');
    }),
    bindPanellists: firestoreAction(({ bindFirestoreRef }, params) => {
      let firestoreRef = firestore.collection('panellists');
      if (params && params.ids) {
        firestoreRef = firestoreRef.where(firebase.firestore.FieldPath.documentId(), 'in', params.ids);
      }
      return bindFirestoreRef('panellists', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindPanellists: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('panellists');
    }),
    create: async (context, data) => {
      const ref = collection.doc();
      data.created = firebase.firestore.FieldValue.serverTimestamp();
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      await ref.set(data, { merge: true });
    },
    update: async (context, { data, id }) => {
      const ref = collection.doc(id);
      data.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();
      console.log('update panel', id, data);
      await ref.update(data);
    },
    delete: async (context, id) => {
      await collection.doc(id).delete();
    },
    addApplications: async (context, { panelId, type, applicationIds }) => {
      const batch = firestore.batch();
      applicationIds.forEach(applicationId => {
        const ref = firestore.collection('applicationRecords').doc(applicationId);
        const data = {};
        data[`${type}.panelId`] = panelId;
        batch.update(ref, data);
      });
      await batch.commit();
      await context.dispatch('update', {
        id: panelId,
        data: {
          applicationIds: firebase.firestore.FieldValue.arrayUnion(...applicationIds),
        },
      });
    },
    removeApplications: async (context, { applicationIds }) => {
      const batch = firestore.batch();
      applicationIds.forEach(applicationId => {
        const ref = firestore.collection('applicationRecords').doc(applicationId);
        const data = {};
        data[`${context.state.record.type}.panelId`] = null;
        batch.update(ref, data);
      });
      await batch.commit();
      await context.dispatch('update', {
        id: context.state.record.id,
        data: {
          applicationIds: firebase.firestore.FieldValue.arrayRemove(...applicationIds),
        },
      });
    },
  },
  state: {
    record: null,
    applications: [],
    panellists: [],
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
