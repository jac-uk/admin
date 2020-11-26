import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';
import tableQuery from '@/helpers/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ rootState, state, commit, bindFirestoreRef }, params) => {
      let firestoreRef;
      if (state.isFavourites === null) { commit('updateFavourites', true); }
      if (state.isFavourites) {
        firestoreRef = firestore
        .collection('exercises')
        .where('favouriteOf', 'array-contains', rootState.auth.currentUser.uid);
      } else {
        firestoreRef = firestore
        .collection('exercises');
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    showFavourites: ({ commit, dispatch }) => {
      commit('updateFavourites', true);
      dispatch('bind');
    },
    showAll: ({ commit, dispatch }) => {
      commit('updateFavourites', false);
      dispatch('bind');
    },
  },
  mutations: {
    updateFavourites(state, isFavourites) {
      state.isFavourites = isFavourites;
    },
  },
  state: {
    records: [],
    isFavourites: null,
  },
};
