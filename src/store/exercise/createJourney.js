import router from '@/router';

// For improved readability, this module deals with page names without their prefix
// All route names are prefixed with this string before navigation
const routeNamePrefix = 'exercise-edit-';

// This is the complete journey available, sorted in order
// Partial journeys should still follow this order, skipping pages which weren't selected by the user
const completeJourneyInOrder = [
  'summary',
  'contacts',
  'shortlisting',
  'timeline',
  'vacancy',
  'eligibility',
  'working-preferences',
  'assessment-options',
  'downloads',
];

const routeLocation = (name, id) => {
  return {
    name,
    params: { id },
  };
};

export default {
  namespaced: true,
  state: {
    journey: [],
    currentPage: null,
  },
  mutations: {
    setJourney(state, journey) {
      state.journey = journey;
      state.currentPage = null;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
  },
  actions: {
    start({ commit }, pages) {
      // Sort the selected pages into the correct order for the journey
      const journey = completeJourneyInOrder.filter((page) => {
        return pages.indexOf(page) !== -1;
      });
      commit('setJourney', journey);
    },
    end({ commit }) {
      commit('setJourney', []);
    },
    setCurrentRoute({ commit }, name) {
      // Trim routeNamePrefix off the beginning of the route name
      if (name.indexOf(routeNamePrefix) === 0) {
        name = name.slice(routeNamePrefix.length);
      }
      commit('setCurrentPage', name);
    },
  },
  getters: {
    currentPageIndex(state) {
      return state.journey.indexOf(state.currentPage);
    },
    nextPageIndex(state, getters) {
      const currentIndex = getters.currentPageIndex;
      const journeyLength = state.journey.length;
      if ((currentIndex + 1) < journeyLength) {
        return (currentIndex + 1);
      } else {
        return null;
      }
    },
    nextPage: (state, getters, rootState, rootGetters) => (defaultRouteName) => {
      const id = rootGetters['exerciseDocument/id'];
      if (id === null) return null;
      const pageIndex = getters.nextPageIndex;
      if (pageIndex === null) {
        if (router.currentRoute.params && router.currentRoute.params.referrer) {
          return routeLocation(router.currentRoute.params.referrer, id);
        } else if (defaultRouteName) {
          return routeLocation(defaultRouteName, id);
        } else {
          return routeLocation('exercise-show-overview', id);
        }
      }
      const name = state.journey[pageIndex];
      return routeLocation(routeNamePrefix + name, id);
    },
  },
};
