import { collection, doc, getDoc, getDocs, setDoc } from '@firebase/firestore';
import { firestore } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { vi, it, describe, beforeEach, afterEach } from 'vitest';

/**
 * @https://vitest.dev/api/vi#vi-mock
 * Use vi.doMock instead of vi.mock to make it execute as the same order as the codebase (prevent it from hoisting),
 * So, the mock module can be imported by src/store/exercise/document.js
 */
vi.doMock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

import exerciseDocument from '@/store/exercise/document';

vi.mock('vuexfire');

describe.skip('store/exercise/single', () => {
  describe('actions', () => {
    const actions = exerciseDocument.actions;

    describe('bind', () => {
      describe('binds using vuexfire bindFirestoreRef()', () => {
        let callToBindFirestoreRef;
        beforeEach(() => {
          callToBindFirestoreRef = actions.bind('TestDocumentID');
        });

        it('binds to `record` key in the state', () => {
          const keyInState = callToBindFirestoreRef[0];
          expect(keyInState).toEqual('record');
        });

        it('binds the `/exercises` document with the given ID', () => {
          const firestoreRef = callToBindFirestoreRef[1];
          expect(firestoreRef).toEqual(doc(collection(firestore, 'exercises'), 'TestDocumentID'));
        });

        it('serializes document data with `vuexfireSerialize` helper', () => {
          const options = callToBindFirestoreRef[2];
          expect(options.serialize).toBe(vuexfireSerialize);
        });
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
      beforeEach(async () => {
        mockDispatch = vi.fn();
        const doc = doc(collection(firestore, 'meta') ,'stats');
        await setDoc(doc, {
          exercisesCount: 0,
        });
      });

      afterEach(() => {
        collection(firestore, 'exercises').data = null;
        collection(firestore, 'meta').data = null;
      });

      const create = () => {
        const context = {
          dispatch: mockDispatch,
        };
        const data = {
          name: 'Example exercise',
          referenceNumber: 'JAC00001',
          type: 'legal',
        };
        return actions.create(context, data);
      };

      it('returns a Promise', () => {
        expect(create()).toBeInstanceOf(Promise);
      });

      describe('the Promise', () => {
        const collectionRef = collection(firestore, 'exercises');

        it('creates a new document in the Firestore collection `exercises`', async () => {
          expect((await getDocs(collectionRef)).size).toBe(0);
          await create();
          expect((await getDocs(collectionRef)).size).toBe(1);
        });

        it('the document data matches the supplied `data` object', async () => {
          await create();
          const doc = (await getDocs(collectionRef)).docs[0];
          const expectedData = {
            name: 'Example exercise',
            referenceNumber: 'JAC00001',
            type: 'legal',
          };
          expect(doc.data()).toEqual(expectedData);
        });

        it('binds the newly created document', async () => {
          await create();
          const doc = (await getDocs(collectionRef)).docs[0];
          expect(mockDispatch).toHaveBeenCalledWith('bind', doc.id);
        });
      });
    });

    describe('save', () => {
      beforeEach(async () => {
        const doc = doc(collection(firestore, 'exercises'), '001');
        await setDoc(doc, {
          name: 'Example exercise',
        });
      });

      afterEach(() => {
        collection(firestore, 'exercises').data = null;
      });

      const save = () => {
        const context = {
          state: {
            record: {
              id: '001',
            },
          },
        };
        const data = {
          exerciseMailbox: 'test@gmail.com',
          seniorSelectionExerciseManager: 'John Smith',
        };
        return actions.save(context, data);
      };

      it('returns a Promise', () => {
        expect(save()).toBeInstanceOf(Promise);
      });

      it('updates the bound Firestore document with the supplied data', async () => {
        await save();

        const docSnapshot = await getDoc(doc(collection(firestore, 'exercises'),'001'));

        const expectedData = {
          name: 'Example exercise',
          exerciseMailbox: 'test@gmail.com',
          seniorSelectionExerciseManager: 'John Smith',
        };

        expect(docSnapshot.data()).toEqual(expectedData);
      });
    });
  });

  describe('getters', () => {
    describe('id', () => {
      it('returns null if no document is loaded', () => {
        const state = {
          record: null,
        };
        expect(exerciseDocument.getters.id(state)).toBeNull();
      });

      it('returns the id of the currently loaded document', () => {
        const state = {
          record: {
            id: 'abc123',
          },
        };
        expect(exerciseDocument.getters.id(state)).toBe('abc123');
      });
    });

    describe('data()', () => {
      it('returns a function', () => {
        const state = {
          record: {},
        };
        expect(exerciseDocument.getters.data(state)).toBeFunction();
      });

      it('returns a clone of the record data (rather than a reference to the state object)', () => {
        const state = {
          record: {
            futureStart: 123,
            hmctsWelshGovLead: 'Test Name',
            name: 'Test Name',
          },
        };

        const recordObject = exerciseDocument.getters.data(state)();
        expect(recordObject).not.toBe(state.record);
        expect(recordObject).toEqual(state.record);
      });
    });
  });
});
