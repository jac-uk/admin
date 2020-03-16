import exerciseDocument from '@/store/exercise/document';
import { firestore } from '@/firebase';
import vuexfireSerialize from '@/helpers/vuexfireSerialize';

jest.mock('@/firebase', () => {
  const firebase = require('firebase-mock');
  const firestore = firebase.MockFirebaseSdk().firestore();
  firestore.autoFlush();
  return { firestore };
});

jest.mock('vuexfire');

xdescribe('store/exercise/single', () => {
  xdescribe('actions', () => {
    const actions = exerciseDocument.actions;

    xdescribe('bind', () => {
      xdescribe('binds using vuexfire bindFirestoreRef()', () => {
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
          expect(firestoreRef).toEqual(firestore.collection('exercises').doc('TestDocumentID'));
        });

        it('serializes document data with `vuexfireSerialize` helper', () => {
          const options = callToBindFirestoreRef[2];
          expect(options.serialize).toBe(vuexfireSerialize);
        });
      });
    });

    xdescribe('unbind', () => {
      it('unbinds key `record`', () => {
        const callToUnbindFirestoreRef = actions.unbind();
        expect(callToUnbindFirestoreRef[0]).toBe('record');
      });
    });

    xdescribe('create', () => {
      let mockDispatch;
      beforeEach(async () => {
        mockDispatch = jest.fn();
        const doc = firestore.collection('meta').doc('stats');
        await doc.set({
          exercisesCount: 0,
        });
      });

      afterEach(() => {
        firestore.collection('exercises').data = null;
        firestore.collection('meta').data = null;
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

      // it('returns a Promise', () => {
      //   expect(create()).toBeInstanceOf(Promise);
      // });

      xdescribe('the Promise', () => {
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
            referenceNumber: 'JAC00001',
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

    xdescribe('save', () => {
      beforeEach(async () => {
        const doc = firestore.collection('exercises').doc('001');
        await doc.set({
          name: 'Example exercise',
        });
      });

      afterEach(() => {
        firestore.collection('exercises').data = null;
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

        const docSnapshot = await firestore.collection('exercises').doc('001').get();
        
        const expectedData = {
          name: 'Example exercise',
          exerciseMailbox: 'test@gmail.com',
          seniorSelectionExerciseManager: 'John Smith',
        };

        expect(docSnapshot.data()).toEqual(expectedData);
      });
    });
  });

  xdescribe('getters', () => {
    xdescribe('id', () => {
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

    xdescribe('data()', () => {
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
