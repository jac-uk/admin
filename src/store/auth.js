import { auth, functions } from '@/firebase';
import { get } from 'lodash';

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
      if (state.authError) commit('setAuthError', null);

      try {
        if (!user) throw new Error();

        const provider = user.providerData && user.providerData.length > 0 ? user.providerData[0] : null;
        // check if email is valid
        if (
          !user.email.match(/(.*@judicialappointments|.*@justice)[.](digital|gov[.]uk)/) ||
          !provider ||
          !['microsoft.com', 'google.com'].includes(provider.providerId)
        ) {
          throw new Error('This site is restricted to employees of the Judicial Appointments Commission');
        }

        // check if user document exists
        let userDoc = await dispatch('users/get', user.uid, { root: true });
        // check if new user
        // 1. user does not exist in authentication and firestore
        // 2. user exists in authentication but not in firestore
        if (!userDoc) {
          // check if user has been invited
          const userInvitation = await dispatch('userInvitations/get', { email: user.email, status: 'pending' }, { root: true });
          if (!userInvitation) throw new Error('You has not been invited to use this site');

          // create user document
          const newUser = {
            displayName: user.displayName || '',
            email: user.email || '',
            disabled: user.disabled || false,
            role: {
              id: userInvitation.roleId || '',
              isChanged: false,
            },
          };
          userDoc = await dispatch('users/create', { id: user.uid, data: newUser }, { root: true });
          // set user role in custom claims
          await functions.httpsCallable('updateUserCustomClaims')({ userId: user.uid });
          // mark user invitation as completed
          await dispatch('userInvitations/save', { id: userInvitation.id, data: { status: 'completed' } }, { root: true });
        }

        // check if user is microsoft user and email is not verified
        if ((user.emailVerified === false) && (get(user, 'providerData.0.providerId', null) === 'microsoft.com')) {
          user = { ...user, emailVerified: true };
          await functions.httpsCallable('ensureEmailVerified')({});
        }

        // refresh token to get latest custom claims
        if (auth.currentUser?.getIdToken) await auth.currentUser.getIdToken(true); 
        const idTokenResult = await user.getIdTokenResult();

        // get user role from custom claims
        const roleId = idTokenResult?.claims?.r || null;
        const permissions = idTokenResult?.claims?.rp || null;
        if (!roleId || !permissions) throw new Error('This user does not have a role');

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
        dispatch('users/bindDoc', user.uid, { root: true });
        return userData;
      } catch (error) {
        if (error.message) commit('setAuthError', error.message);
        auth.signOut();
      }
    },
    setAuthError({ commit }, message) {
      commit('setAuthError', message);
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
