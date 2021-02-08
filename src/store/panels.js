// eslint-disable-next-line
import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

const collectionRef = firestore.collection('panels');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params ) => {
      // eslint-disable-next-line no-console
      // console.log('bind panels', params);
      let firestoreRef = collectionRef
        .where('exerciseId', '==', params.exerciseId)
        .where('type', '==', params.type);
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    create: async (context, data ) => {
      // eslint-disable-next-line no-console
      // console.log('store create', data);
      await collectionRef.add(data);
    },
    updateMembers: async (context, data) => {
      const panel = context.getters.getPanel(data.id)[0];
      // eslint-disable-next-line no-console
      console.log('updateMembers panel  ', { panel });
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
      await collectionRef.doc(data.id).set({
        members: members,
      }, { merge: true });
    },
    updatePanel: async (context, data) => {
      // const panel = context.getters.getPanel(data.id);
      return await collectionRef.doc(data.id).update(data);
      // },
      // await collectionRef.doc(data.id).set({
      //   members: members,
      // }, { merge: true });

    },
  },
  state: {
    records: [],
  },
  mutations: {
    
  },
  getters: {
    getPanel: (state) => (id) => {
      // eslint-disable-next-line no-console
      // console.log('getPanel', id, state.records);
      const returnObj = state.records.filter(item => {
        // eslint-disable-next-line no-console
        // console.log('filter item', id, item);
        return item.id === id;
      });
      return (returnObj);
    },
    isSift: () => (url) => {
      // TODO: add isSift to PanelsNew.vue and PanelsView.vue
      let route = false;
      if (url) {
        route = url.includes('/tasks/sift/');
      }
      return route;
    },
    isSelectionDay: () => (url) => {
      // TODO: add isSelectionDay to PanelsNew.vue and PanelsView.vue
      let route = false;
      if (url) {
        route = url.includes('/tasks/selection-days/');
      }
      return route;
    },
  },
};
