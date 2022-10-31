import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { tableAsyncQuery } from '@jac-uk/jac-kit/components/Table/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(async ({ bindFirestoreRef, state, commit }, params) => {
      let firestoreRef = firestore
        .collection('applications')
        .where('exerciseId', '==', params.exerciseId);
      if (params.status) {
        firestoreRef = firestoreRef.where('status', '==', params.status);
      }
      if (params.characterChecks) {
        firestoreRef = firestoreRef.where('characterChecks.declaration', '==', params.characterChecks);
      }

      const res = await tableAsyncQuery(state.records, firestoreRef, params, null);
      firestoreRef = res.queryRef;
      commit('total', res.total);

      if (firestoreRef) {
        return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
      } else {
        commit('records', []);
      }
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
  },
  state: {
    records: [],
    total: 0,
  },
  mutations: {
    records(state, data) {
      state.records = data;
    },
    total(state, data) {
      state.total = data;
    },
  },
  getters: {
    getById: (state) => (applicationId) => {
      return getById(state.records, applicationId);
    },
    reasonableAdjustments(state) {
      return reasonableAdjustmentsReport(state.records);
    },
  },
};

const getById = (applications, applicationId) => {
  return applications.find(application => application.id === applicationId);
};

const reasonableAdjustmentsReport = (applications) => {
  const report = {
    totalCount: applications.length,
    candidates: [],
  };
  applications.forEach((application) => {
    if (application.personalDetails.reasonableAdjustments) {
      report.candidates.push({
        userId: application.userId,
        name: application.personalDetails.fullName,
        email: application.personalDetails.email,
        phone: application.personalDetails.phone,
        requiresAdjustments: application.personalDetails.reasonableAdjustments,
        adjustmentsDetails: application.personalDetails.reasonableAdjustmentsDetails,
      });
    }
  });

  return report;
};
