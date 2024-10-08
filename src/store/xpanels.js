// eslint-disable-next-line
import { writeBatch, query, doc, collection, addDoc, setDoc, deleteDoc, getDoc, getDocs, updateDoc, where, limit, runTransaction, serverTimestamp, arrayUnion, arrayRemove } from '@firebase/firestore';
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
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      // eslint-disable-next-line no-console
      // console.log('bind panels', params);
      let firestoreRef = query(
        collectionRef,
        where('exerciseId', '==', params.exerciseId),
        where('type', '==', params.type)
      );
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    create: async (context, data ) => {
      // eslint-disable-next-line no-console
      // console.log('store create', data);
      await addDoc(collectionRef, data);
    },
    updateMembers: async (context, data) => {
      const panel = context.getters.getPanel(data.id);
      // eslint-disable-next-line no-console
      // console.log('updateMembers panel  ', { panel });
      const members = panel.members ? [...panel.members] : [];
      if (data.action === 'edit') {
        members[data.idx] = data.members;
      }
      if (data.action === 'new') {
        members.push(data.members);
      }
      if (data.action === 'delete') {
        members.splice(data.idx, 1);
      }
      // eslint-disable-next-line no-console
      // console.log('updateMembers store members: ', members);
      await setDoc(doc(collectionRef, data.id), {
        members: members,
      }, { merge: true });
    },
    updatePanel: async (context, params) => {
      return await updateDoc(doc(collectionRef, params.id), params.data);
    },
    deletePanel: async (context, id) => {
      await deleteDoc(doc(collectionRef, id));
      // @TODO@ - ?also empty google drive folder, if it has been created?
      return true;
    },
    bindPanelApplications: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = query(
        collection(firestore, 'applicationRecords'),
        where('exercise.id', '==', params.exerciseId),
        where(`panelIds.${params.type}`, '==', params.panelId)
      );
      firestoreRef = tableQuery(state.panelApplications, firestoreRef, params);
      return bindFirestoreRef('panelApplications', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindPanelApplications: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('panelApplications');
    }),
    removePanelApplications: async (context, { panelType, applicationIds }) => {
      const batch = writeBatch(firestore);
      applicationIds.forEach(applicationId => {
        const ref = doc(collection(firestore, 'applicationRecords'), applicationId);
        const data = {};
        data[`panelIds.${panelType}`] = '';
        batch.update(ref, data);
      });
      await batch.commit();
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    records: [],
    panelApplications: [],
  },
  getters: {
    getPanel: (state) => (id) => {
      const returnObj = state.records.filter(item => {
        return item.id === id;
      });
      if (returnObj.length > 0) {
        return clone(returnObj[0]);
      } else {
        return;
      }
    },
    isSift: () => (url) => {
      // TODO: add isSift to PanelsNew.vue and PanelsView.vue
      let route = false;
      if (url) {
        route = url.includes('/reports/sift');
      }
      return route;
    },
    isSelectionDay: () => (url) => {
      // TODO: add isSelectionDay to PanelsNew.vue and PanelsView.vue
      let route = false;
      if (url) {
        route = url.includes('/reports/selection');
      }
      return route;
    },
    isScenario: () => (url) => {
      let route = false;
      if (url) {
        route = url.includes('/reports/scenario');
      }
      return route;
    },
  },
};
