import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import dayjs from 'dayjs';

const module = {
  namespaced: true,
  state: {
    records: [],
    availability: false,
    lastFetched: null,    // dayjs() object
  },
  mutations: {
    setRecords(state, value) {
      state.records = value;
    },
    setAvailability(state, value) {
      state.availability = value;
    },
    setLastFetched(state, value) {
      state.lastFetched = value;
    },
  },
  actions: {
    async getLatestReleases({ commit }) {
      const records = await httpsCallable(functions, 'getLatestReleasesV2')();
      commit('setRecords', records.data);
      commit('setAvailability', records.data.length > 0);
      commit('setLastFetched', dayjs());

      await httpsCallable(functions, 'ojTestCallable')();
    },
  },
  getters: {
    getLastFetchedDT: (state) => {
      return state.lastFetched ? state.lastFetched.format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
};

export default module;
