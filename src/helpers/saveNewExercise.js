import firebase from '@/firebase';

const saveNewExercise = (data) => {
  const firestore = firebase.firestore;
  const collection = firestore().collection('vacancies');

  return collection.add({
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    openAt: firestore.FieldValue.serverTimestamp(),
    ...data,
  });
};

export default saveNewExercise;
