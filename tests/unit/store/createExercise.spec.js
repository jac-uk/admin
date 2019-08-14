import createExercise from '@/store/createExercise';

describe('store/createExercise', () => {
  const mutations = createExercise.mutations;
  const actions = createExercise.actions;
  const getters = createExercise.getters;
  let state;

  beforeEach(() => {
    state = {
       newExercise: {
        title: null,
      },
    };
  });

  // test mutations
  describe('mutations', () => {

    describe('setTitle', () => {
      it('sets title in the state', () => {
        const name = 'Test Name';
        mutations.setTitle(state, name);

        expect(state.newExercise.title).toBe(name);
      });
    });

    describe('setType', () => {
      it('sets setType in the state', () => {
        const type = 'Test Type';
        mutations.setType(state, type);

        expect(state.newExercise.type).toBe(type);
      });
    });

     describe('resetExercise', () => {
      it('resets exercise state to initial', () => {
        mutations.setTitle(state, 'Test Title');
        mutations.setType(state, 'Legal');
        mutations.resetExercise(state);

        expect(state.newExercise.type).toBe(null);
        expect(state.newExercise.title).toBe(null);
      });
    });
  });

  //test actions
  describe('actions', () => {
    let context;

    beforeEach(() => {
      context = {
        commit: jest.fn(),
        getters,
        state,
      };
    });

    describe('setExerciseTitle', () => {
      it('commits setTitle', () => {
        actions.setExerciseTitle(context, 'TestName');

        expect(context.commit).toHaveBeenCalledWith('setTitle', 'TestName');
      });
    });

    describe('setExerciseType', () => {
      it('commits setType', () => {
        actions.setExerciseType(context, 'TestTitle');

        expect(context.commit).toHaveBeenCalledWith('setType', 'TestTitle');
      });
    });

    describe('resetNewExercise', () => {
      it('commits resetNewExercise', () => {
        actions.resetNewExercise(context);

        expect(context.commit).toHaveBeenCalledWith('resetExercise');
      });
    });
  });

  // test getters
  describe('getters', () => {

    describe('exerciseData', () => {

      describe('when newExercise exists', () => {
        it('returns newExercise data', () => {
          state.newExercise = {
            title: 'Test Vacancy',
            anotherKey: 'value',
          };

          expect(getters.exerciseData(state)).toBe(state.newExercise);
        });
      });

      describe('when newExercise does not exist', () => {
        it('returns null', () => {
          state.newExercise = {
             title: null,
          };

          expect(getters.exerciseData(state)).toBe(null);
        });
      });

    });

    describe('exerciseTitle', () => {
      describe('when exercise title exists', () => {
        it('returns exercise title', () => {
          state.newExercise = {
            title: 'Road User Charging Adjudicators',
            anotherKey: 'value',
          };

          expect(getters.exerciseTitle(state)).toBe(state.newExercise.title);
        });
      });

      describe('when exercise title does not exist', () => {
        it('returns null', () => {
          state.newExercise = {
             title: null,
             anotherKey: 'value',
          };

          expect(getters.exerciseTitle(state)).toBe(null);
        });
      });
    });
    
  });
});
