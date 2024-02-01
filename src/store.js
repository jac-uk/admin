import { createStore } from 'vuex';

// Vuex modules
import ui from '@/store/ui';
import auth from '@/store/auth';
import services from '@/store/services';
import exerciseCollection from '@/store/exercise/collection';
import exerciseCreateJourney from '@/store/exercise/createJourney';
import exerciseDocument from '@/store/exercise/document';
import applications from '@/store/applications';
import application from '@/store/application';
import assessment from '@/store/assessment';
import assessments from '@/store/assessments';
import notifications from '@/store/notifications';
import invitations from '@/store/invitations';
import events from '@/store/events';
import clipboard from '@/store/clipboard';

import applicationRecords from '@/store/applicationRecords';
import characterChecks from '@/store/characterChecks/characterChecks';
import candidates from '@/store/candidates';
import notes from '@/store/notes';
import candidateApplications from '@/store/candidateApplications';

import tasks from '@/store/tasks/collection';
import task from '@/store/tasks/document';
import panels from '@/store/panels';
// import panels from '@/store/panels/collection';
import panel from '@/store/panels/document';
import panellists from '@/store/panellists/collection';
import panellist from '@/store/panellists/document';
import checks from '@/store/checks/collection';
// import candidateForms from '@/store/candidateForms/collection';
import candidateForm from '@/store/candidateForms/document';
import candidateFormRecords from '@/store/candidateForms/records';

import exerciseDiversity from '@/store/exercise/diversity/document';
import messageBase from '@/store/baseClasses/messageBase';
import LateApplicationRequestMsg from '@/store/messages/lateApplicationRequest';
import LateApplicationResponseMsg from '@/store/messages/lateApplicationResponse';

import users from '@/store/users';
import userInvitations from '@/store/userInvitations';
import roles from '@/store/roles';
import vacancy from '@/store/vacancy';

import bugReports from '@/store/bugReports/collection';
import bugReport from '@/store/bugReports/document';

//const store = new Vuex.Store({
const store = createStore({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: import.meta.env.DEV,
  modules: {
    // Keep these in alphabetical order for readability in Vue Chrome Extension
    applicationRecords,
    applications,
    application,
    assessment,
    assessments,
    auth,
    candidateApplications,
    candidateForm,
    candidateFormRecords,
    candidates,
    characterChecks,
    checks,
    clipboard,
    events,
    exerciseCollection,
    exerciseCreateJourney,
    exerciseDiversity,
    exerciseDocument,
    invitations,
    lateApplicationRequestMsg: new LateApplicationRequestMsg().getModule(),
    lateApplicationResponseMsg: new LateApplicationResponseMsg().getModule(),
    messageBase: new messageBase().getModule(),
    notes,
    notifications,
    panel,
    panellist,
    panellists,
    panels,
    roles,
    services,
    task,
    tasks,
    ui,
    users,
    userInvitations,
    vacancy,
    bugReport,
    bugReports,
  },
  state: {
    packageVersion: import.meta.env.PACKAGE_VERSION || '0',
  },
  mutations: {},
  actions: {},
  getters: {
    appVersion: (state) => {
      return state.packageVersion;
    },
    appEnvironment: () => {
      if (import.meta.env.VITE_FIREBASE_USE_EMULATORS == 'true') {
        return 'LOCAL';
      }
      const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
      if (projectId.indexOf('-develop') >= 0) {
        return 'DEVELOP';
      }
      if (projectId.indexOf('-staging') >= 0) {
        return 'STAGING';
      }
      if (projectId.indexOf('-production') >= 0) {
        return 'PRODUCTION';
      }
      return '';
    },
    isProduction: (state, getters) => {
      return getters.appEnvironment === 'PRODUCTION';
    },
    isDevelop: (state, getters) => {
      return getters.appEnvironment === 'DEVELOP';
    },
  },
});

export default store;
