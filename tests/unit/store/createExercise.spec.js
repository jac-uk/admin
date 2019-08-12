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
  });

  // test getters
  describe('getters', () => {

    describe('exerciseData', () => {

      describe('when newExercise exists', () => {
        it('returns newExercise data', () => {
          state.newExercise = {
            title: 'HelloTest',
            type: 'Senior',
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
    
  });
});
