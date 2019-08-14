/* eslint-disable */
import saveNewExercise from '@/helpers/saveNewExercise';
import { firestore } from '@/firebase';

jest.mock('@/firebase', () => {
  const firebasemock = require('firebase-mock');
  const mockfirestore = new firebasemock.MockFirestore();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    // use null if your code does not use RTDB
    () => null,
    // use null if your code does not use AUTHENTICATION
    () => null,
    // use null if your code does not use FIRESTORE
    () => mockfirestore,
    // use null if your code does not use STORAGE
    () => null,
    // use null if your code does not use MESSAGING
    () => null,
  );

  mockfirestore.autoFlush();
  return { 
    __esModule: true,
    default: mocksdk,
    firestore: mocksdk.firestore(),
  };
});

describe('saveNewExercise', () => {
  it('gets exercise data as a parameter and saves it to database', async () => {
    const data = {
      title: 'test',
      somethingElse: 'test1',
    };

    await saveNewExercise(data);
    
    const testVacancies = await firestore.collection('vacancies').get();
    expect(testVacancies.docs.length).toBe(1);

    const testVacancy = testVacancies.docs[0].data();
    expect(testVacancy).toEqual(expect.objectContaining(data));
  });
});
