import { firestore } from '@/firebase';
import { firestoreAction } from 'vuexfire';

export default {
  namespaced: true,
  actions: {
    bindVacancies: firestoreAction(context => {
      return context.bindFirestoreRef('vacancies', firestore.collection('vacancies'));
    }),
  },
  state: {
    vacancies: [],
  },
};
