import { auth } from '@/firebase';
import { ROLES } from '@/helpers/roles';
import { users, getUserObject } from '@/helpers/users';

const module = {
  namespaced: true,
  state: {
    currentUser: null,
    authError: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setAuthError(state, message) {
      state.authError = message;
    },
  },
  actions: {
    setCurrentUser({ state, commit }, user) {
      if (user === null) {
        commit('setCurrentUser', null);
      } else {
        if (state.authError) { commit('setAuthError', null); }
        let allOk = false;
        if (user.emailVerified) {
          if (user.email.indexOf('@judicialappointments.digital') > 0) {
            allOk = true;
          }
          if (user.email.indexOf('@judicialappointments.gov.uk') > 0) {
            allOk = true;
          }
        }
        if (allOk) {
          // 1. read user object from users collection (or users.js for now)
          const userObject = getUserObject(user.email); //or uuid?
          // 2. const permissions = ROLES[role].permissions or get permissions from permissions collection
          const role = userObject[0].role;
          commit('setCurrentUser', {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            role: role,
            permissions: ROLES[role].permissions,
          });
          if (role !== 'SUPERADMIN') {
            users.push(user);
            const data = JSON.stringify(users);
            localStorage.setItem('users', data);
          }
        } else {
          auth().signOut();
          commit('setAuthError', 'This site is restricted to employees of the Judicial Appointments Commission');
        }
      }
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
    getUserPermissions(state) {
      if (state.currentUser && state.currentUser.permissions) {
        return state.currentUser.permissions;
      }
      return null;
    },
  },
};

export default module;
