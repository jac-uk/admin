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
    agencyReport(state) {
      return agencyReport(state.records);
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

const agencyReport = (applications) => {
  const report = {
    totalCount: applications.length,
    acro: {
      candidates: [],
      count: 0,
    },
    sra: {
      candidates: [],
      count: 0,
    },
    bsb: {
      candidates: [],
      count: 0,
    },
    jcio: {
      candidates: [],
      count: 0,
    },
    hmrc: {
      candidates: [],
      count: 0,
    },
    other: {
      gmc: {
        name: 'General Medical Council',
        candidates: [],
        count: 0,
      },
      rics: {
        name: 'Royal Institution of Chartered Surveyors',
        candidates: [],
        count: 0,
      },
    },
  };
  applications.forEach((application) => {
    const qualifications = application.qualifications || [];

    const sra = qualifications.find((qualification) => qualification.type === 'solicitor');
    const bsb = qualifications.find((qualification) => qualification.type === 'barrister');

    report.acro.candidates.push({
      id: application.id,
      fullName: application.personalDetails.fullName,
      dateOfBirth: application.personalDetails.dateOfBirth,
      placeOfBirth: application.personalDetails.placeOfBirth,
      nationalInsuranceNumber: application.personalDetails.nationalInsuranceNumber,
    });
    report.acro.count++;

    if (sra) {
      report.sra.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        date: sra.date,
        membershipNumber: sra.membershipNumber,
      });
      report.sra.count++;
    }

    if (bsb) {
      report.bsb.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        date: bsb.date,
        membershipNumber: bsb.membershipNumber,
      });
      report.bsb.count++;
    }

    if (application.feePaidOrSalariedJudge) {
      report.jcio.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        judicialOffice: application.feePaidOrSalariedJudge,
        experience: application.experience,
      });
      report.jcio.count++;
    }

    if (application.personalDetails.hasVATNumbers) {
      report.hmrc.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        dateOfBirth: application.personalDetails.dateOfBirth,
        hasVATNumbers: application.personalDetails.hasVATNumbers,
        VATNumbers: application.personalDetails.VATNumbers,
      });
      report.hmrc.count++;
    }

    if (application.generalMedicalCouncilNumber) {
      report.other.gmc.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        date: application.generalMedicalCouncilDate,
        membershipNumber: application.generalMedicalCouncilNumber,
      });
      report.other.gmc.count++;
    }

    if (application.royalInstitutionCharteredSurveyorsNumber) {
      report.other.rics.candidates.push({
        id: application.id,
        fullName: application.personalDetails.fullName,
        date: application.royalInstitutionCharteredSurveyorsDate,
        membershipNumber: application.royalInstitutionCharteredSurveyorsNumber,
      });
      report.other.rics.count++;
    }
  });

  return report;
};
