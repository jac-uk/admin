import generateRandomReference from '@/helpers/generateRef';

const module = {
  namespaced: true,
  state: {
    newExercise: {
      title: null,
      reference: generateRandomReference(1, 100),
    },
  },
  mutations: {
    setTitle(state, name) {
      state.newExercise.title = name;
    },
  },
  actions: {
    setExerciseTitle({ commit }, name) {
      commit('setTitle', name);
    },
  },
  getters: {
    exerciseData(state) {
      return state.newExercise.title !== null ? state.newExercise : null;
    },
  },
};

export default module;
