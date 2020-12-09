import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import clone from 'clone';

const collection = firestore.collection('applications');

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, id) => {
      const firestoreRef = collection.doc(id);
      return bindFirestoreRef('record', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('record');
    }),
    unlock: async ({ state }) => {
      const id = state.record.id;
      const ref = collection.doc(id);
      const data = {
        status: 'draft',
      };
      await ref.update(data);
    },
    save: async ({ state }, data) => {
      const ref = collection.doc(state.record.id);
      await ref.set(data, { merge: true });
    },
    update: async (context, { data, id }) => {
      const ref = collection.doc(id);
      await ref.update(data);
    },
    // NOTE: this is copied across from Candidate app. @todo work out a better way to share code (or use an api)
    submit: async ({ state, dispatch }) => {
      if (state.record) {
        if (state.record.referenceNumber) {
          const data = {
            status: 'applied',
            appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };
          dispatch('save', data);
        } else {
          const vacancyMetaRef = firestore.doc(`vacancies/${state.record.exerciseId}/meta/stats`);
          const vacancyReferenceNumber = state.record.exerciseRef;
          const applicationRef = firestore.doc(`applications/${state.record.id}`);
          return firestore.runTransaction((transaction) => {
            return transaction.get(vacancyMetaRef).then((doc) => {
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
                appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
              return applicationReferenceNumber;
            });
          });
        }
      }
    },
    withdraw: async (context, data ) => {
      const applicationId = data.applicationId;

      await context.dispatch('update', { data: { status: STATUS.WITHDRAWN }, id: applicationId });

      //  If IAs has started ensure relevant assessments documents are removed (soft deleted)
      context.dispatch('assessment/delete', { id: applicationId }, { root: true });

      // If Qualifying Tests have started ensure the relevant qualifyingTestResponse document is removed (soft deleted)
      context.dispatch('qualifyingTestResponses/delete', { id: applicationId }, { root: true });
    },
  },
  state: {
    record: null,
  },
  getters: {
    data: (state) => () => {
      return clone(state.record);
    },
  },
};
