import { functions } from '@/firebase';

export default {
  namespaced: true,
  state: {
    users: [],
  },
  getters: {
    enabledUsers: (state) => {
      return state.users.filter(user => !user.disabled);
    },
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
  },
  actions: {
    async getUsers({ commit }) {
      try {
        const res = await functions.httpsCallable('adminGetUsers')();
        commit('setUsers', res.data);
      } catch (error) {
        commit('setUsers', []);
      }
    },
  },
};
