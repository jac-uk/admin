import exerciseSingle from '@/store/exercise/single';
import { firestore } from '@/firebase';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire');

describe('store/exercise/single', () => {
  describe('actions', () => {
    const actions = exerciseSingle.actions;
    describe('bind', () => {
      it('binds state `record` to the document with the specified ID in the Firestore `exercises` collection', () => {
        const callToBindFirestoreRef = actions.bind('TestDocumentID');
        const keyInState = callToBindFirestoreRef[0];
        const firestoreRef = callToBindFirestoreRef[1];
        expect(keyInState).toEqual('record');
        expect(firestoreRef).toEqual(firestore.collection('exercises').doc('TestDocumentID'));
      });
    });
  });
});
