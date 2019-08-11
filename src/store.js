import Vue from 'vue';
import { vuexfireMutations } from 'vuexfire';
import Vuex from 'vuex';

import auth from '@/store/auth';
import vacancies from '@/store/vacancies';
import createExercise from '@/store/createExercise'

Vue.use(Vuex);

const store = new Vuex.Store({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    auth,
    vacancies,
    createExercise
  },
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    init: async ({ dispatch }) => {
      if(store.getters.isSignedIn) {
        await Promise.all([
          dispatch('vacancies/bind'),
        ]);
      }
    },
  },
  getters: {},
});

export default store;
