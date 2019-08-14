import firebase, { firestore } from '@/firebase';

const saveNewExercise = (data) => {
  const collection = firestore.collection('vacancies');

  return collection.add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    openAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...data,
  });
};

export default saveNewExercise;
