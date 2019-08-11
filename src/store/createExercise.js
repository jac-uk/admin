const module = {
  state: {
    name: null,
    type: null,
  },
  mutations: {
    setName(state, name) {
      state.name = name;
    },
    setType(state, type) {
      state.type = type;
    },
  },
  actions: {
    setExerciseName({ commit }, name) {
      if(name) {
        commit('setName', name);
      }

      console.log("This state: ", this.state);
    },
    setExerciseType({ commit }, type) {
      if(type) {
        commit('setName', type);
      }

      console.log("This state: ", this.state);
    }
  },
  getters: {
    hasName(state) {
      return (state.name !== null);
    },
    hasType(state) {
      return (state.type !== null);
    },
  },
};

export default module;
