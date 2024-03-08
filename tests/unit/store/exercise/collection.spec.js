import exerciseCollection from '@/store/exercise/collection';
import { firestore } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { vi, describe, beforeEach, it } from 'vitest';
import { collection, orderBy as firebaseOrderBy } from '@firebase/firestore';

/**
* @vitest-environment jsdom
*/

vi.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

vi.mock('vuexfire');

describe.skip('store/exercise/collection', () => {
  describe('actions', () => {
    const actions = exerciseCollection.actions;

    describe('bind', () => {
      describe('binds using vuexfire bindFirestoreRef()', () => {
        let callToBindFirestoreRef;
        beforeEach(() => {
          callToBindFirestoreRef = actions.bind();
        });

        it('binds to `records` key in the state', () => {
          const keyInState = callToBindFirestoreRef[0];
          expect(keyInState).toEqual('records');
        });

        it('binds the `/exercises` collection', () => {
          const firestoreRef = callToBindFirestoreRef[1];
          expect(firestoreRef).toEqual(collection(firestore, 'exercises', firebaseOrderBy('referenceNumber', 'desc')));
        });

        it('serializes document data with `vuexfireSerialize` helper', () => {
          const options = callToBindFirestoreRef[2];
          expect(options.serialize).toBe(vuexfireSerialize);
        });
      });
    });

    describe('unbind', () => {
      it('unbinds key `records`', () => {
        const callToUnbindFirestoreRef = actions.unbind();
        expect(callToUnbindFirestoreRef[0]).toBe('records');
      });
    });
  });
});
