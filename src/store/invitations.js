import firebase from '@firebase/app';
import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

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
        if (emailsToAdd.length) {
          // Delete emails from database that were removed by the user
          context.state.records.forEach (async (r) => {
            const toBeAdded = emailsToAdd.find(email => email === r.candidate.email);
            if (!toBeAdded) {
              const ref = firestore.collection('invitations').doc(r.id);
              await ref.delete();
            }
          });
          // Add new emails that are not in the database
          emailsToAdd.forEach(email => {
            const existing = context.state.records.find(r => r.candidate.email === email);
            if (existing) return;
            collectionRef.add({
              vacancy: {
                id: exercise.id,
              },
              candidate: {
                email: email,
                id: null,  // populated when candidate updates the invite
              },
              status: 'created',  // 'created' | 'invited' | 'accepted' | 'rejected'
              statusLog: {
                created: firebase.firestore.FieldValue.serverTimestamp(),
                invited: null, // populated when email invite has been sent (out of scope right now)
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
