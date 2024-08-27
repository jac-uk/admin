import { collection, doc, updateDoc, setDoc, getDoc, addDoc, serverTimestamp, runTransaction } from '@firebase/firestore';
import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
// import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { getStageWithdrawalStatus } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import clone from 'clone';

const collectionName = 'applications';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = doc(collectionRef, id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = doc(collectionRef, id);
      const data = {
        status: 'draft',
      };
      await updateDoc(ref, data);
    },
    save: async ({ dispatch, state }, data) => {
      if (state.record) {
        const ref = doc(collectionRef, state.record.id);
        await setDoc(ref, data, { merge: true });
      } else {
        const ref = await addDoc(collectionRef, data);
        await dispatch('bind', ref.id);
      }
    },
    update: async (context, { data, id }) => {
      const ref = doc(collectionRef, id);
      await setDoc(ref, data, { merge: true });
    },
    // NOTE: this is copied across from Candidate app. @todo work out a better way to share code (or use an api)
    submit: async ({ state, dispatch }) => {
      if (state.record) {
        if (state.record.referenceNumber) {
          const data = {
            status: 'applied',
            appliedAt: serverTimestamp(),
          };
          await dispatch('save', data);
        } else {
          const vacancyMetaRef = doc(firestore, `vacancies/${state.record.exerciseId}/meta/stats`);
          const vacancyReferenceNumber = state.record.exerciseRef;
          const applicationRef = doc(firestore, `applications/${state.record.id}`);
          return await runTransaction(firestore, async (transaction) => {
            const doc = await transaction.get(vacancyMetaRef);
            let newApplicationsCount;
            if (!doc.exists) {
              newApplicationsCount = 1;
            } else {
              newApplicationsCount = doc.data().applicationsCount + 1;
            }
            const characters = 'abcdefghijklmnopqrstuvwxyz';
            let randomCharacters = '';
            for (let i = 0, len = 3; i < len; i++) {
              randomCharacters += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            const applicationReferenceNumber = `${vacancyReferenceNumber  }-${  randomCharacters  }${(10000 + newApplicationsCount).toString().substr(1)}`;
            transaction.set(vacancyMetaRef, {
              applicationsCount: newApplicationsCount,
            }, { merge: true });
            transaction.update(applicationRef, {
              status: 'applied',
              referenceNumber: applicationReferenceNumber,
              appliedAt: serverTimestamp(),
            });
            return applicationReferenceNumber;

          });
        }
      }
    },
    withdraw: async (context, data ) => {
      const applicationId = data.applicationId;

      await context.dispatch('update', { data: { status: getStageWithdrawalStatus(context.rootState.exerciseDocument.record) }, id: applicationId });

      //  If IAs has started ensure relevant assessments documents are removed (soft deleted)
      context.dispatch('assessment/delete', { id: applicationId }, { root: true });

      // If Qualifying Tests have started ensure the relevant qualifyingTestResponse document is removed (soft deleted)
      // TODO Update Task and QT platform (within digital-platform)
      // context.dispatch('qualifyingTestResponses/delete', { id: applicationId }, { root: true });
    },
    createDraft: async (context, {
      exerciseId,
      exerciseName,
      exerciseRef,
      candidateId,
      candidateEmail,
      candidateFullname,
    }) => {
      const data = {
        status: 'draft',
        progress: { started: true },
        personalDetails: {
          email: candidateEmail,
          fullName: candidateFullname,
        },
        userId: candidateId,
        exerciseId: exerciseId,
        exerciseName: exerciseName,
        exerciseRef: exerciseRef,
        createdAt: serverTimestamp(),
      };
      await context.dispatch('save', data);
    },
  },
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
  state: {
    record: null,
    isExtractingSelfAssessment: false,
  },
  getters: {
    data: (state) => () => {
      return clone(state.record);
    },
    exists: () => async (id) => {
      const applicationRef = doc(firestore, 'applicationRecords', id);
      const applicationDoc = await getDoc(applicationRef);
      return applicationDoc.exists();
    },
  },
};
