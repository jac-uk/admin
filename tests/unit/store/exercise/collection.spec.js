import exerciseCollection from '@/store/exercise/collection';
import { firestore } from '@/firebase';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire');

describe('store/exercise/collection', () => {
  describe('actions', () => {
    const actions = exerciseCollection.actions;
    describe('bind', () => {
      it('binds state `records` to the Firestore collection `exercises` ordered by `openAt` descending', () => {
        const callToBindFirestoreRef = actions.bind();
        const keyInState = callToBindFirestoreRef[0];
        const firestoreRef = callToBindFirestoreRef[1];
        expect(keyInState).toEqual('records');
        expect(firestoreRef).toEqual(firestore.collection('exercises').orderBy('openAt', 'desc'));
      });
    });
  });
});
