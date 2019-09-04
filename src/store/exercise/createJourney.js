/* eslint-disable */
export default {
  namespaced: true,
  state: {
    journeyPages: [],
    currentPage: null,
  },
  mutations: {
    setJourneyPages({ commit }, pages) {},
    setCurrentPage({ commit }, page) {},
    reset({ commit }) {},
  },
  getters: {
    nextPage() {},
    previousPage() {},
    isInProgress() {},
  },
};
