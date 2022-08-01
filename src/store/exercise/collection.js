import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ rootState, state, bindFirestoreRef }, params) => {
      let firestoreRef;
      if (state.isFavourites) {
        firestoreRef = firestore
        .collection('exercises')
        .where('favouriteOf', 'array-contains', rootState.auth.currentUser.uid);
      } else if (state.isArchived) {
        firestoreRef = firestore
        .collection('exercises')
        .where('state', '==', 'archived');
      } else {
        firestoreRef = firestore
        .collection('exercises')
        .where('state', '!=', 'archived')
        .orderBy('state');
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    showFavourites: ({ commit, dispatch }) => {
      commit('updateFavourites', true);
      commit('updateArchived', false);
      dispatch('bind');
    },
    showAll: ({ commit, dispatch }) => {
      commit('updateFavourites', false);
      commit('updateArchived', false);
      dispatch('bind');
    },
    showArchived: ({ commit, dispatch }) => {
      commit('updateFavourites', false);
      commit('updateArchived', true);
      dispatch('bind');
    },
    storeItems: (context, { items }) => {
      context.commit('selectedItems', items);
    },
  },
  mutations: {
    updateArchived(state, isArchived) {
      state.isArchived = isArchived;
    },
    updateFavourites(state, isFavourites) {
      state.isFavourites = isFavourites;
    },
    selectedItems(state, items) {
      state.selectedItems = items;
    },
  },
  state: {
    records: [],
    isFavourites: false,
    isArchived: false,
    selectedItems: [],
  },
};
