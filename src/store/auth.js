import { auth, functions } from '@/firebase';
import { get } from 'lodash';

const module = {
  namespaced: true,
  state: {
    currentUser: null,
    authError: null,
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user;
    },
    setAuthError (state, message) {
      state.authError = message;
    },
  },
  actions: {
    async setCurrentUser ({ state, commit }, user) {
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
          'warren.searle@judicialappointments.digital',
          'halcyon@judicialappointments.digital',
          'tom.russell@judicialappointments.digital',
          'andrew.isaac@judicialappointments.digital',
          'blaise.buckland@judicialappointments.digital',
          'julian.sandler@justice.gov.uk',
          'lisa.grant@justice.gov.uk',
          'rita.kumi.ampofo@justice.gov.uk',
          'wincen.lowe@justice.gov.uk',
          'lisias.loback@judicialappointments.digital',
          'molly.meadows@justice.gov.uk',
        ].indexOf((user.email).toLowerCase()) >= 0) {
          allOk = true;
        }
        if (allOk) {
          let shouldEnsureEmailVerified = false;
          if ((user.emailVerified === false) && (get(user, 'providerData.0.providerId', null) === 'microsoft.com')) {
            user = { ...user, emailVerified: true };
            shouldEnsureEmailVerified = true;
          }
          let role = 'staff';
          if (
            [ // TODO User roles!
              'warren.searle@judicialappointments.digital',
              'tom.russell@judicialappointments.digital',
              'andrew.isaac@judicialappointments.digital',
              'blaise.buckland@judicialappointments.digital',
              'lisias.loback@judicialappointments.digital',
            ].indexOf((user.email).toLowerCase() >= 0)
          ) {
            role = 'superadmin';
          }
          commit('setCurrentUser', {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            role: role,
          });
          if (shouldEnsureEmailVerified) {
            await functions.httpsCallable('ensureEmailValidated')({});
          }
        } else {
          auth().signOut();
          commit('setAuthError', 'This site is restricted to employees of the Judicial Appointments Commission');
        }
      }
    },
  },
  getters: {
    isSignedIn (state) {
      return (state.currentUser !== null);
    },
    getEmail (state) {
      return state.currentUser.email;
    },
  },
};

export default module;
