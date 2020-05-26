import Vue from 'vue';
import Vuex from 'vuex';
import { vuexfireMutations } from 'vuexfire';
Vue.use(Vuex);

// Vuex modules
import auth from '@/store/auth';
import exerciseCollection from '@/store/exercise/collection';
import exerciseCreateJourney from '@/store/exercise/createJourney';
import exerciseDocument from '@/store/exercise/document';
import applications from '@/store/applications';
import application from '@/store/application';
import assessments from '@/store/assessments';
import stageReview from '@/store/stage/review';
import stageSelected from '@/store/stage/selected';
import stageHandover from '@/store/stage/handover';
import stageRecommended from '@/store/stage/recommended';
import stageShortlisted from '@/store/stage/shortlisted';

const store = new Vuex.Store({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    exerciseCollection,
    exerciseCreateJourney,
    exerciseDocument,
    applications,
    application,
    assessments,
    stageReview,
    stageSelected,
    stageHandover,
    stageRecommended,
    stageShortlisted,
  },
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {},
  getters: {},
});

export default store;
