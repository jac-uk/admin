import { functions } from '@/firebase';
import { get } from 'lodash';
import { convertPermissions } from '../permissions';

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
    setUserRole(state, role) {
      state.currentUser = { ...state.currentUser, ...role };
    },
    setAuthError(state, message) {
      state.authError = message;
    },
  },
  actions: {
    async setCurrentUser({ state, commit }, user) {
      if (user === null || (user && user.isNewUser)) {
        commit('setCurrentUser', null);
      } else {
        if (state.authError) {
          commit('setAuthError', null);
        }

        const provider = user.providerData && user.providerData.length > 0 ? user.providerData[0] : null;
        if (
          user.email.match(/(.*@judicialappointments|.*@justice)[.](digital|gov[.]uk)/) &&
          (provider && ['microsoft.com', 'google.com'].includes(provider.providerId))
        ) {
          let shouldEnsureEmailVerified = false;
          if ((user.emailVerified === false) && (get(user, 'providerData.0.providerId', null) === 'microsoft.com')) {
            user = { ...user, emailVerified: true };
            shouldEnsureEmailVerified = true;
          }

          const idTokenResult = await user.getIdTokenResult();
          // get user role
          const roleId = idTokenResult?.claims?.r || null;
          const permissions = idTokenResult?.claims?.rp || null;
          const userData = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
          };
          const role = {
            roleId: roleId,
            rolePermissions: permissions,
          };
          commit('setCurrentUser', userData);
          commit('setUserRole', role);

          if (shouldEnsureEmailVerified) {
            await functions.httpsCallable('ensureEmailVerified')({});
          }

          return userData;
        } else {
          commit('setAuthError', 'This site is restricted to employees of the Judicial Appointments Commission');
        }
      }

      return null;
    },
    async setUserRole({ commit }, role) {
      if (role) {
        commit('setUserRole', {
          rolePermissions: convertPermissions(role),
        });
      } else {
        commit('setAuthError', 'This user does not have a role');
      }
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
    getEmail(state) {
      if (state.currentUser) {
        return state.currentUser.email;
      }
      return null;
    },
    hasPermissions: state => permissions => {
      const rolePermissions = state.currentUser ? state.currentUser.rolePermissions : null;
      return rolePermissions && Array.isArray(rolePermissions) && permissions.every(p => rolePermissions.includes(p));
    },
    getDisplayName(state) {
      return state.currentUser.displayName;
    },
  },
};

export default module;
