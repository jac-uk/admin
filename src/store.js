import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations, firestoreOptions } from 'vuexfire';
Vue.use(Vuex);
firestoreOptions.wait = true;

// Vuex modules
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
import panels from '@/store/panels/collection';
import panel from '@/store/panels/document';
import panellists from '@/store/panellists/collection';
import panellist from '@/store/panellists/document';

const store = new Vuex.Store({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    services,
    exerciseCollection,
    exerciseCreateJourney,
    exerciseDocument,
    applications,
    application,
    assessment,
    assessments,
    events,
    clipboard,
    notifications,
    invitations,
    stageReview,
    stageSelected,
    stageHandover,
    stageRecommended,
    stageShortlisted,
    candidates,
    notes,
    candidateApplications,
    qualifyingTest,
    qualifyingTestResponses,
    connectionMonitor,
    qualifyingTestReports,
    qualifyingTestReport,
    tasks,
    task,
    panels,
    panel,
    panellists,
    panellist,
    characterChecks,
  },
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0',
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
      const projectId = process.env.VUE_APP_FIREBASE_PROJECT_ID;
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
  },
});

export default store;
