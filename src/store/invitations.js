import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

const collectionRef = firestore.collection('invitations');

export default {
  namespaced: true,
  state: {
    records: [],
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId }) => {
      const firestoreRef = collectionRef
        .where('vacancy.id', '==', exerciseId);
      return bindFirestoreRef('records', firestoreRef, { serialize: vuexfireSerialize });
    }),
    unbind: firestoreAction(({ unbindFirestoreRef }) => {
      return unbindFirestoreRef('records');
    }),
    addInvites: async (context, { emails }) => {
      const exercise = context.rootState.exerciseDocument.record;
      if (emails && emails.length && exercise && exercise.id) {
        const emailsToAdd = emails;
        if (context.state.records) {
          // TODO check for emails that already have an invitation
        }
        if (emailsToAdd.length) {
          emailsToAdd.forEach(email => {
            collectionRef.add({
              vacancy: {
                id: exercise.id,
                name: exercise.name,
                referenceNumber: exercise.referenceNumber,
                applicationOpenDate: exercise.applicationOpenDate,
                applicationCloseDate: exercise.applicationCloseDate,
              },
              candidate: {
                email: email,
                id: null,  // populated when candidate updates the invite
              },
              status: 'created',  // 'created' | 'invited' | 'accepted' | 'rejected'
              statusLog: {
                created: firebase.firestore.FieldValue.serverTimestamp(),
                invited: null,  // populated when email invite has been sent (out of scope right now)
                accepted: null, // populated when candidate accepts the invitation
                rejected: null, // populated when candidate rejects the invitation
              },
            });
          });
        }
      }
    },
  },
};
