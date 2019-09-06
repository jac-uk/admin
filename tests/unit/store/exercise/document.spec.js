import exerciseDocument from '@/store/exercise/document';
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
    const actions = exerciseDocument.actions;

    describe('bind', () => {
      it('binds key `record` to the document with the specified ID in the Firestore `exercises` collection', () => {
        const callToBindFirestoreRef = actions.bind('TestDocumentID');
        const keyInState = callToBindFirestoreRef[0];
        const firestoreRef = callToBindFirestoreRef[1];
        expect(keyInState).toEqual('record');
        expect(firestoreRef).toEqual(firestore.collection('exercises').doc('TestDocumentID'));
      });
    });

    describe('unbind', () => {
      it('unbinds key `record`', () => {
        const callToUnbindFirestoreRef = actions.unbind();
        expect(callToUnbindFirestoreRef[0]).toBe('record');
      });
    });

    describe('create', () => {
      let mockDispatch;
      beforeEach(() => {
        mockDispatch = jest.fn();
      });

      afterEach(() => {
        firestore.collection('exercises').data = null;
      });

      const create = () => {
        const context = {
          dispatch: mockDispatch,
        };
        const data = {
          name: 'Example exercise',
          type: 'legal',
        };
        return actions.create(context, data);
      };

      it('returns a Promise', () => {
        expect(create()).toBeInstanceOf(Promise);
      });

      describe('the Promise', () => {
        const collection = firestore.collection('exercises');

        it('creates a new document in the Firestore collection `exercises`', async () => {
          expect((await collection.get()).size).toBe(0);
          await create();
          expect((await collection.get()).size).toBe(1);
        });

        it('the document data matches the supplied `data` object', async () => {
          await create();
          const doc = (await collection.get()).docs[0];
          const expectedData = {
            name: 'Example exercise',
            type: 'legal',
          };
          expect(doc.data()).toEqual(expectedData);
        });

        it('binds the newly created document', async () => {
          await create();
          const doc = (await collection.get()).docs[0];
          expect(mockDispatch).toHaveBeenCalledWith('bind', doc.id);
        });
      });
    });
  });
});
