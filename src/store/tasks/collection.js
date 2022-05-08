import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
//import { taskNextStatus } from '@/helpers/exerciseHelper';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, commit }, params) => {
      console.log('tasks bind');
      commit('setLoaded', true);
      commit('setParams', params);
      const firestoreRef = firestore.collection(`exercises/${params.exerciseId}/tasks`);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef, commit }) => {
      commit('setLoaded', false);
      commit('setParams', {});
      return unbindFirestoreRef('records');
    }),
    // progressTask: async ({ state, getters }, params) => {
    //   console.log('progress task', state, params);

    //   // check params
    //   if (params.exerciseId !== state.params.exerciseId) return '';

    //   const task = getters['getTask'](params.type);
    //   console.log('task', task);

    //   const currentStatus = task.status;
    //   const nextStatus = taskNextStatus(currentStatus);
    //   // if (nextStatus !== currentStatus) {
    //   //   const ref = firestore.doc(`exercises/${params.exerciseId}/tasks/${params.type}`);
    //   //   const data = {};
    //   //   data['status'] = nextStatus;
    //   //   data[`statusLog.${nextStatus}`] = firebase.firestore.FieldValue.serverTimestamp();
    //   //   await ref.update(data);
    //   // }
    //   return nextStatus;
    // },
  },
  mutations: {
    setLoaded(state, value) {
      state.loaded = value;
    },
    setParams(state, params) {
      state.params = params;
    },
  },
  getters: {
    getTask: (state) => (type) => {
      if (state.records.length === 0) return null;
      const result = state.records.filter(task => task.id === type);
      return result[0];
    },
  },
  state: {
    records: [],
    params: {},
    loaded: false,
  },
};
