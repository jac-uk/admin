import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
Vue.use(Vuex);

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

import stageReview from '@/store/stage/review';
import stageSelected from '@/store/stage/selected';
import stageHandover from '@/store/stage/handover';
import stageRecommended from '@/store/stage/recommended';
import stageShortlisted from '@/store/stage/shortlisted';
import candidates from '@/store/candidates';
import notes from '@/store/notes';
import candidateApplications from '@/store/candidateApplications';
import qualifyingTest from '@/store/qualifyingTest/qualifyingTest';
import qualifyingTestResponses from '@/store/qualifyingTest/qualifyingTestResponses';
import connectionMonitor from '@/store/connectionMonitor';
import qualifyingTestReports from '@/store/qualifyingTestReports/collection';
import qualifyingTestReport from '@/store/qualifyingTestReports/document';
import panels from '@/store/panels';

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
    panels,
  },
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  getters: {},
});

export default store;
