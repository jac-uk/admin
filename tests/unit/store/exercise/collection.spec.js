import exerciseCollection from '@/store/exercise/collection';
import { firestore } from '@/firebase';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire', () => ({
  firestoreAction: jest.fn(callback => {
    const context = {
      bindFirestoreRef: (name, firebaseRef) => {
        return [name, firebaseRef];
      },
    };
    return callback(context);
  }),
}));

describe('store/exercise/collection', () => {

  describe('actions', () => {
    const actions = exerciseCollection.actions;
    describe('bind', () => {
      it('binds state `records` to the Firestore collection `exercises` ordered by `openAt` descending', () => {
        const keyInState = actions.bind[0];
        const firestoreRef = actions.bind[1];
        expect(keyInState).toEqual('records');
        expect(firestoreRef).toEqual(firestore.collection('exercises').orderBy('openAt', 'desc'));
      });
    });
  });
});
