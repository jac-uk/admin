import { auth } from '@/firebase';

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
      if (user === null || (user && user.isNewUser)) {
        commit('setCurrentUser', null);
      } else {
        if (state.authError) { commit('setAuthError', null); }
        let allOk = false;

        if (user.email.indexOf('@judicialappointments.gov.uk') > 0) {
          allOk = true;
        } else if ([
          'warren.searle@judicialappointments.digital',
          'halcyon@judicialappointments.digital',
          'tom.russell@judicialappointments.digital',
          'maria.brookes@judicialappointments.digital',
          'joy.adeagbo@judicialappointments.digital',
          'julian.sandler@justice.gov.uk',
          'lisa.grant@justice.gov.uk',
          'rita.kumi.ampofo@justice.gov.uk',
          'wincen.lowe@justice.gov.uk',
          'molly.meadows@justice.gov.uk',
          'thomas.hudson.testing@judicialappointments.digital',
          'liam.price.testing@judicialappointments.digital',
          'trefor.walters.testing@judicialappointments.digital',
          'tom.russelltesting.testing@judicialappointments.digital',
          'stefan.thomas.testing@judicialappointments.digital',
        ].indexOf((user.email).toLowerCase()) >= 0) {
          allOk = true;
        }
        if (allOk) {
          let role = 'staff';
          if (
            [ // TODO User roles!
              'warren.searle@judicialappointments.digital',
              'tom.russell@judicialappointments.digital',
              'maria.brookes@judicialappointments.digital',
              'joy.adeagbo@judicialappointments.digital',
              'thomas.hudson.testing@judicialappointments.digital',
              'liam.price.testing@judicialappointments.digital',
              'trefor.walters.testing@judicialappointments.digital',
              'tom.russelltesting.testing@judicialappointments.digital',
              'stefan.thomas.testing@judicialappointments.digital',
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
  },
};

export default module;
