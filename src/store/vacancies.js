import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';

export default {
  namespaced: true,
  actions: {
    bind: firestoreAction(context => {
      return context.bindFirestoreRef('vacancies', firestore.collection('vacancies').orderBy('openAt'));
    }),
  },
  state: {
    vacancies: [],
  },
};
