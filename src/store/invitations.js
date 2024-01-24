// TODO: KO upgrade to modular API
import { query, doc, collection, addDoc, deleteDoc, where, serverTimestamp } from '@firebase/firestore';

import { firestore } from '@/firebase';
import { firestoreAction } from '@/helpers/vuexfireJAC';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';

const collectionName = 'invitations';
const collectionRef = collection(firestore, collectionName);

export default {
  namespaced: true,
  state: {
    records: [],
  },
  actions: {
    bind: firestoreAction(({ bindFirestoreRef }, { exerciseId }) => {
      const firestoreRef = query(collectionRef, where('vacancy.id', '==', exerciseId));
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
              const ref = doc(collectionRef, r.id);
              await deleteDoc(ref);
            }
          });
          // Add new emails that are not in the database
          emailsToAdd.forEach(email => {
            const existing = context.state.records.find(r => r.candidate.email === email);
            if (existing) return;
            addDoc(collectionRef, {
              vacancy: {
                id: exercise.id,
              },
              candidate: {
                email: email,
                id: null,  // populated when candidate updates the invite
              },
              status: 'created',  // 'created' | 'invited' | 'accepted' | 'rejected'
              statusLog: {
                created: serverTimestamp(),
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
  mutations: {
    set(state, { name, value }) {
      state[name] = value;
    },
  },
};
