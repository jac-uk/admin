import { createStore } from 'vuex';

import { vuexfireMutations, firestoreOptions } from 'vuexfire';
firestoreOptions.wait = true;

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
import stageReview from '@/store/stage/review';
import stageSelected from '@/store/stage/selected';
import stageHandover from '@/store/stage/handover';
import stageRecommended from '@/store/stage/recommended';
import stageShortlisted from '@/store/stage/shortlisted';
import characterChecks from '@/store/characterChecks/characterChecks';
import candidates from '@/store/candidates';
import notes from '@/store/notes';
import candidateApplications from '@/store/candidateApplications';
import qualifyingTest from '@/store/qualifyingTest/qualifyingTest';
import qualifyingTestResponses from '@/store/qualifyingTest/qualifyingTestResponses';
import connectionMonitor from '@/store/connectionMonitor';
import qualifyingTestReports from '@/store/qualifyingTestReports/collection';
import qualifyingTestReport from '@/store/qualifyingTestReports/document';

import tasks from '@/store/tasks/collection';
import task from '@/store/tasks/document';
// OLD: import panels from '@/store/panels';
import panels from '@/store/panels/collection';
import panel from '@/store/panels/document';
import panellists from '@/store/panellists/collection';
import panellist from '@/store/panellists/document';
import checks from '@/store/checks/collection';

import exerciseDiversity from '@/store/exercise/diversity/document';
import messageBase from '@/store/baseClasses/messageBase';
import LateApplicationRequestMsg from '@/store/messages/lateApplicationRequest';
import LateApplicationResponseMsg from '@/store/messages/lateApplicationResponse';

//const store = new Vuex.Store({
const store = createStore({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: import.meta.env.NODE_ENV !== 'production',
  modules: {
    // Keep these in alphabetical order for readability in Vue Chrome Extension
    applicationRecords,
    applications,
    application,
    assessment,
    assessments,
    auth,
    candidateApplications,
    candidates,
    characterChecks,
    checks,
    clipboard,
    connectionMonitor,
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
    qualifyingTest,
    qualifyingTestResponses,
    qualifyingTestReports,
    qualifyingTestReport,
    services,
    stageReview,
    stageSelected,
    stageHandover,
    stageRecommended,
    stageShortlisted,
    task,
    tasks,
    ui,
  },
  state: {
    packageVersion: import.meta.env.PACKAGE_VERSION || '0',
  },
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  getters: {
    appVersion: (state) => {
      return state.packageVersion;
    },
    appEnvironment: () => {
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
