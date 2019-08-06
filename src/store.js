import Vue from 'vue';
import { vuexfireMutations } from 'vuexfire';
import Vuex from 'vuex';
import auth from '@/store/auth';
import vacancies from '@/store/vacancies';

Vue.use(Vuex);

const store = new Vuex.Store({
  // Don't use strict mode in production for performance reasons (https://vuex.vuejs.org/guide/strict.html)
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    auth,
    vacancies,
  },
  state: {},
  mutations: {
    ...vuexfireMutations,
  },
  actions: {
    init: async ({ dispatch }) => {
      await Promise.all([
        dispatch('vacancies/bindVacancies'),
      ]);
    },
  },
  getters: {},
});

store.dispatch('init');

export default store;
