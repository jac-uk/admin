export default {
  namespaced: true,
  actions: {
    bind: ({ commit }, params) => {
      commit('setLoaded', true);
      commit('setParams', params);
    },
    unbind: ({ commit }) => {
      commit('setLoaded', false);
      commit('setParams', {});
    },
    create: async ({ commit }, { data }) => {
      commit('addRecord', data);
    },
  },
  mutations: {
    setLoaded(state, value) {
      state.loaded = value;
    },
    setParams(state, params) {
      state.params = params;
    },
    addRecord(state, record) {
      state.records.push(record);
    },
  },
  state: {
    records: [
      { id: 1, type: '100%', created: Date.now(), createdBy: 'Jane Smith', status: 'pass', note: 'All present and correct' },
      { id: 2, type: '10%', created: Date.now(), createdBy: 'John Johnson', status: 'fail', note: 'Not sure about M Howley :)' },
      { id: 3, type: 'Custom', created: Date.now(), createdBy: 'Matt Howley', status: null, note: '' },
    ],
    params: {},
    loaded: false,
  },
};
