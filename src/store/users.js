import { functions } from '@/firebase';

export default {
  namespaced: true,
  state: {
    users: [],
  },
  getters: {
    enabledMicrosoftUsers: (state) => {
      return state.users
        .filter(user => {
          if (user.disabled) return false;
          let isMicrosoft = false;
          user.providerData.forEach(item => {
            if (item.providerId === 'microsoft.com') {
              isMicrosoft = true;
            }
          });
          return isMicrosoft;
        })
        .sort((a, b) => {
          // sort by email alphabetically
          const emailA = a.email.toLowerCase();
          const emailB = b.email.toLowerCase();
          if (emailA < emailB) return -1;
          else if (emailA > emailB) return 1;
          else return 0;
        });
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
