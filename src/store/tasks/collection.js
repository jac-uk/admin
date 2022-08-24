import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, commit }, params) => {
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
