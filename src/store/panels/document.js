import { query, doc, collection, documentId, setDoc, deleteDoc, writeBatch, updateDoc, where, serverTimestamp, arrayUnion, arrayRemove } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import clone from 'clone';

const collectionName = 'panels';
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
    bindApplications: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'applicationRecords'),
        where('exercise.id', '==', params.exerciseId),
        where(`${params.type}.panelId`, '==', params.panelId)
      );
      firestoreRef = tableQuery(state.applications, firestoreRef, params);
      return bindFirestoreRef('applications', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindApplications: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('applications');
    }),
    bindPanellists: firestoreAction(({ bindFirestoreRef }, params) => {
      let firestoreRef = collection(firestore, 'panellists');
      if (params && params.ids) {
        firestoreRef = query(firestoreRef, where(documentId(), 'in', params.ids));
      }
      return bindFirestoreRef('panellists', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindPanellists: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('panellists');
    }),
    create: async (context, data) => {
      const ref = doc(collectionRef);
      data.created = serverTimestamp();
      data.lastUpdated = serverTimestamp();
      await setDoc(ref, data, { merge: true });
    },
    update: async (context, { data, id }) => {
      const ref = doc(collectionRef, id);
      data.lastUpdated = serverTimestamp();
      await updateDoc(ref, data);
    },
    delete: async (context, id) => {
      await deleteDoc(doc(collectionRef, id));
    },
    addApplications: async (context, { panelId, type, applicationIds, applicationRecords, timetable }) => {
      const batch = writeBatch(firestore);

      // update application redcords
      applicationIds.forEach(applicationId => {
        const ref = doc(collection(firestore, 'applicationRecords'), applicationId);
        const data = {};
        data[`${type}.panelId`] = panelId;
        batch.update(ref, data);
      });
      await batch.commit();

      // update panel
      const saveData = {
        applicationIds: arrayUnion(...applicationIds),
      };
      applicationRecords.forEach(applicationRecord => {
        const arData = { referenceNumber: applicationRecord.application.referenceNumber };
        if (type != 'sift') {
          arData.fullName = applicationRecord.candidate.fullName;
        }
        saveData[`applications.${applicationRecord.id}`] = arData;
      });
      if (timetable) saveData.timetable = timetable;
      await context.dispatch('update', {
        id: panelId,
        data: saveData,
      });
    },
    removeApplications: async (context, { applicationIds }) => {
      const batch = writeBatch(firestore);
      // update application records
      applicationIds.forEach(applicationId => {
        const ref = doc(collection(firestore, 'applicationRecords'), applicationId);
        const data = {};
        data[`${context.state.record.type}.panelId`] = null;
        batch.update(ref, data);
      });
      await batch.commit();
      // update panel
      const panel = context.state.record;
      const saveData = {
        applicationIds: arrayRemove(...applicationIds),
      };
      const applications = clone(panel.applications);
      applicationIds.forEach(applicationId => delete applications[applicationId] );
      saveData.applications = applications;
      if (panel.timetable) {
        const timetable = clone(panel.timetable);
        applicationIds.forEach(applicationId => {
          timetable.forEach(item => {
            if (item.applicationIds) {
              const index = item.applicationIds.indexOf(applicationId);
              if (index >= 0) {
                item.applicationIds.splice(index, 1);
              }
            }
          });
        });
        saveData.timetable = timetable;
      }
      await context.dispatch('update', {
        id: context.state.record.id,
        data: saveData,
      });
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
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
    markingScheme: (state) => {
      if (state.record === null) return null;
      return clone(state.record.markingScheme);
    },
  },
};
