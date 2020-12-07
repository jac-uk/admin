import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

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
    storeItems: (context, { items }) => {
      context.commit('selectedItems', items);
    },
  },
  mutations: {
    updateFavourites(state, isFavourites) {
      state.isFavourites = isFavourites;
    },
    selectedItems(state, items) {
      state.selectedItems = items;
    },
  },
  state: {
    records: [],
    isFavourites: null,
    selectedItems: [],
  },
};
