import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';

const module = {
  namespaced: true,
  state: {
    records: [],
    lastFetched: null,
  },
  mutations: {
    setRecords(state, value) {
      state.records = value;
    },
    setLastFetched(state, value) {
      state.lastFetched = value;
    },
  },
  actions: {
    async getLatestReleases({ commit }) {
      const records = await httpsCallable(functions, 'getLatestReleases')();
      commit('setRecords', records.data);
    },
  },
};

export default module;
