const module = {
  namespaced: true,
  state: {
    fullScreen: false,
  },
  mutations: {
    setFullScreen(state, value) {
      state.fullScreen = value;
    },
  },
  actions: {
    enterFullScreen({ commit }) {
      commit('setFullScreen', true);
    },
    exitFullScreen({ commit }) {
      commit('setFullScreen', false);
    },
  },
};

export default module;
