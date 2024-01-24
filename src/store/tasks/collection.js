import { collection } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import clone from 'clone';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, commit }, params) => {
      commit('setLoaded', true);
      commit('setParams', params);
      const firestoreRef = collection(firestore, `exercises/${params.exerciseId}/tasks`);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef, commit }) => {
      commit('setLoaded', false);
      commit('setParams', {});
      return unbindFirestoreRef('records');
    }),
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
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
      return clone(result[0]);
    },
  },
  state: {
    records: [],
    params: {},
    loaded: false,
  },
};
