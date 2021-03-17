import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import tableQuery from '@jac-uk/jac-kit/helpers/tableQuery';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef, state }, params) => {
      let firestoreRef = firestore
        .collection('applications')
        .where('exerciseId', '==', params.exerciseId);
      if (params.status) {
        firestoreRef = firestoreRef.where('status', '==', params.status);
      }
      if (params.characterChecks) {
        firestoreRef = firestoreRef.where('characterChecks.declaration', '==', params.characterChecks);
      }

      firestoreRef = tableQuery(state.records, firestoreRef, params);

      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
  },
  state: {
    records: [],
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
