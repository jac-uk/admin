const module = {
  state: {
    newExercise: {
      title: null,
    },
  },
  mutations: {
    setTitle(state, name) {
      state.newExercise.title = name;
    },
  },
  actions: {
    setExerciseTitle({ commit }, name) {
      if(name) {
        commit('setTitle', name);
      }
    },
  },
  getters: {
    exerciseData(state) {
      return state.newExercise.title !== null ? state.newExercise : null;
    },
  },
};

export default module;
