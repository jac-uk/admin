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
    async setCurrentUser({ state, commit, dispatch }, user) {
      if (user === null || (user && user.isNewUser)) {
        commit('setCurrentUser', null);
      } else {
        if (state.authError) {
          commit('setAuthError', null);
        }
        let allOk = false;

        if (user.email.indexOf('@judicialappointments.gov.uk') > 0) {
          allOk = true;
        } else if ([
          'drie@judicialappointments.digital',
          'warren.searle@judicialappointments.digital',
          'halcyon@judicialappointments.digital',
          'tom.russell@judicialappointments.digital',
          'nick.addy@judicialappointments.digital',
          'isabel.coleman@justice.gov.uk',
          'julian.sandler@justice.gov.uk',
          'lisa.grant@justice.gov.uk',
          'wincen.lowe@justice.gov.uk',
          'lisias.loback@judicialappointments.digital',
          'molly.meadows@justice.gov.uk',
          'katharine.hanley@judicialappointments.gov.uk',
          'digitalteam@judicialappointments.digital',
          'seniorleader@judicialappointments.digital',
          'jacstaff@judicialappointments.digital',
          'readonly@judicialappointments.digital',
        ].indexOf((user.email).toLowerCase()) >= 0) {
          allOk = true;
        }
        if (allOk) {
          let shouldEnsureEmailVerified = false;
          if ((user.emailVerified === false) && (get(user, 'providerData.0.providerId', null) === 'microsoft.com')) {
            user = { ...user, emailVerified: true };
            shouldEnsureEmailVerified = true;
          }

          // get user document from firestore
          const userDoc = await dispatch('users/get', user.uid, { root: true });
          if (userDoc) {
            const data = {
              uid: userDoc.id,
              email: userDoc.email,
              emailVerified: userDoc.emailVerified,
              displayName: userDoc.displayName,
              role: userDoc.role,
            };
            commit('setCurrentUser', data);
            if (shouldEnsureEmailVerified) {
              await functions.httpsCallable('ensureEmailValidated')({});
            }
            return data;
          }
        } else {
          commit('setAuthError', 'This site is restricted to employees of the Judicial Appointments Commission');
        }
      }

      return null;
    },
    async setUserRole({ commit }, role) {
      commit('setUserRole', {
        rolePermissions: convertPermissions(role),
      });
    },
  },
  getters: {
    isSignedIn(state) {
      return (state.currentUser !== null);
    },
    isRoleChanged(state) {
      return state.currentUser?.role?.isChanged;
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
