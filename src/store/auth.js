const module = {
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
  },
  actions: {
    setCurrentUser({commit}, user) {
      if (user === null) {
        commit('setCurrentUser', null);
      } else {
        commit('setCurrentUser', {
          uid: user.uid,
          email: user.email,
        });
      }
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
    emailDomainIsValid(state) {
      return state.currentUser && state.currentUser.email.split('@')[1] === 'judicialappointments.digital';
    },
  },
};

export default module;
