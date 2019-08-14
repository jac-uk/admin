import generateRandomReference from '@/helpers/generateRef';

const module = {
  namespaced: true,
  state: {
    newExercise: {
      title: null,
      type: null,
      reference: generateRandomReference(1, 100),
    },
  },
  mutations: {
    setTitle(state, name) {
      state.newExercise.title = name;
    },
    setType(state, type) {
      state.newExercise.type = type;
    },
    resetExercise(state) {
      state.newExercise = {
        title: null,
        type: null,
        reference: generateRandomReference(1, 100),
      };
    },
  },
  actions: {
    setExerciseTitle({ commit }, name) {
      commit('setTitle', name);
    },
    setExerciseType({ commit }, type) {
      commit('setType', type);
    },
    resetNewExercise({ commit }) {
      commit('resetExercise');
    },
  },
  getters: {
    exerciseData(state) {
      return state.newExercise.title !== null ? state.newExercise : null;
    },
    exerciseTitle(state) {
      return state.newExercise.title !== null ? state.newExercise.title : null;
    },
  },
};

export default module;
