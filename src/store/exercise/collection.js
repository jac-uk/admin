import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import { logEvent } from '@/helpers/logEvent';

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
        .where('state', 'in', ['draft', 'review', 'ready', 'shortlisting', 'selection', 'handover', 'recomended', 'approved']);
      }
      if (params) {
        // Ensure if the where clause uses an inequality that it appears as the first argument to Query.orderBy()
        if (params.where.length) {
          for (const w of params.where) {
            if (['<', '<=', '!=', 'not-in', '>', '>='].includes(w.comparator)) {
              firestoreRef = firestoreRef.orderBy(w.field);
            }
          }
        }
      }
      firestoreRef = tableQuery(state.records, firestoreRef, params);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    bindDraft: firestoreAction(({ bindFirestoreRef }) => {
      const firestoreRef = firestore
        .collection('exercises')
        .where('state', '==', 'draft');
      return bindFirestoreRef('draftRecords', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbindDraft: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('draftRecords');
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
      context.commit('setSelectedItems', items);
    },
    unarchive: async ({ commit, state, dispatch }) => {
      const loggingData = {
        exerciseIds: [],
        exerciseRefs: [],
      };
      const batch = firestore.batch();
      state.selectedItems.forEach( id => {
        const ref = firestore.collection('exercises').doc(id);
        const record = state.records.find(record => record.id === id);
        batch.update(ref, {
          state: record.hasOwnProperty('stateBeforeArchive') ? record.stateBeforeArchive : 'ready',
          stateBeforeArchive: null,
        });
        loggingData.exerciseIds.push(id);
        loggingData.exerciseRefs.push(record.referenceNumber);
      });
      await batch.commit();
      commit('resetSelectedItems');
      logEvent('info', 'Exercises archived', loggingData);
      dispatch('bind');
    },
    archive: async ({ commit, state, dispatch }) => {
      const loggingData = {
        exerciseIds: [],
        exerciseRefs: [],
      };
      const batch = firestore.batch();
      state.selectedItems.forEach( id => {
        const ref = firestore.collection('exercises').doc(id);
        const record = state.records.find(record => record.id === id);
        batch.update(ref, {
          state: 'archived',
          stateBeforeArchive: record.state,
        });
        loggingData.exerciseIds.push(id);
        loggingData.exerciseRefs.push(record.referenceNumber);
      });
      await batch.commit();
      commit('resetSelectedItems');
      logEvent('info', 'Exercises archived', loggingData);
      dispatch('bind');
    },
    delete: async ({ commit, state }) => {
      const loggingData = {
        exerciseIds: [],
        exerciseRefs: [],
      };
      const batch = firestore.batch();
      state.selectedItems.forEach(id => {
        const ref = firestore.collection('exercises').doc(id);
        const record = state.records.find(record => record.id === id);
        batch.update(ref, {
          state: 'deleted',
          stateBeforeDelete: record.state,
        });
        loggingData.exerciseIds.push(id);
        loggingData.exerciseRefs.push(record.referenceNumber);
      });
      await batch.commit();
      commit('resetSelectedItems');
      logEvent('info', 'Exercises deleted', loggingData);
    },
    getLocalById({ state }, id) {
      // Check if the local records have the id and return the record, ie does not hit the db
      return state.records.find(element => element.id === id);
    },
  },
  mutations: {
    updateArchived(state, isArchived) {
      state.isArchived = isArchived;
    },
    updateFavourites(state, isFavourites) {
      state.isFavourites = isFavourites;
    },
    setSelectedItems(state, items) {
      state.selectedItems = items;
    },
    resetSelectedItems(state) {
      state.selectedItems = [];
    },
  },
  state: {
    records: [],
    draftRecords: [],
    isFavourites: false,
    isArchived: false,
    selectedItems: [],
  },
};
