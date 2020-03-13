import exerciseCollection from '@/store/exercise/collection';
import { firestore } from '@/firebase';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire');

xdescribe('store/exercise/collection', () => {
  xdescribe('actions', () => {
    const actions = exerciseCollection.actions;

    xdescribe('bind', () => {
      xdescribe('binds using vuexfire bindFirestoreRef()', () => {
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
          expect(firestoreRef).toEqual(firestore.collection('exercises').orderBy('referenceNumber', 'desc'));
        });

        it('serializes document data with `vuexfireSerialize` helper', () => {
          const options = callToBindFirestoreRef[2];
          expect(options.serialize).toBe(vuexfireSerialize);
        });
      });
    });

    xdescribe('unbind', () => {
      it('unbinds key `records`', () => {
        const callToUnbindFirestoreRef = actions.unbind();
        expect(callToUnbindFirestoreRef[0]).toBe('records');
      });
    });
  });
});
