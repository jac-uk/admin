import ExerciseEditVacancy from '@/views/Exercises/Edit/Vacancy';
import { shallowMount } from '@vue/test-utils';

const exercise = {
  typeOfExercise: 'legal',
  isCourtOrTribunal: 'court',
};

const mockStore = {
  dispatch: jest.fn(),
  state: {
    exerciseDocument: {
      record: {},
    },
  },
  getters: {
    'exerciseCreateJourney/nextPage': { name: 'mock-next-page' },
    'exerciseDocument/data': () => exercise,
  },
};

const mockRouter = {
  push: jest.fn(),
};

const createTestSubject = () => {
  return shallowMount(ExerciseEditVacancy, {
    mocks: {
      $store: mockStore,
      $router: mockRouter,
    },
  });
};

xdescribe('views/Exercises/Edit/Vacancy', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createTestSubject();
  });

  describe('template', () => {
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('contains a <h1>', () => {
      expect(wrapper.contains('h1')).toBe(true);
    });

    it('contains a <form>', () => {
      expect(wrapper.find('form').exists()).toBe(true);
    });

    it('the <form> calls the `save` method when submitted', () => {
      const mockSave = jest.fn();
      wrapper.setMethods({ save: mockSave });
      wrapper.find('form').trigger('submit');
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('the <form> contains a "Save and continue" submit button', () => {
      const button = wrapper.find('form button');
      expect(button.element.type).toBe('submit');
      expect(button.text()).toBe('Save and continue');
    });
  });

  describe('data', () => {
    const booleanFields = [
      'isSPTWOffered',
    ];
    describe.each(booleanFields)('exercise.%s', (fieldName) => {
      let originalValue;
      beforeEach(() => {
        originalValue = exercise[fieldName];
      });
      afterEach(() => {
        exercise[fieldName] = originalValue;
      });

      describe(`when database value for "${fieldName}" is undefined`, () => {
        it('defaults to `null`', () => {
          exercise[fieldName] = undefined;
          wrapper = createTestSubject();
          expect(wrapper.vm.exercise[fieldName]).toBeNull();
        });
      });

      describe(`when database value for "${fieldName}" is boolean true`, () => {
        it('is `true`', () => {
          exercise[fieldName] = true;
          wrapper = createTestSubject();
          expect(wrapper.vm.exercise[fieldName]).toBe(true);
        });
      });

      describe(`when database value for "${fieldName}" is boolean false`, () => {
        it('is `false`', () => {
          exercise[fieldName] = false;
          wrapper = createTestSubject();
          expect(wrapper.vm.exercise[fieldName]).toBe(false);
        });
      });
    });
  });

  describe('methods', () => {
    describe('save', () => {
      const exerciseData = {
        futureStart: '20',
        location: 'Some court somewhere',
      };

      beforeEach(() => {
        mockStore.dispatch.mockClear();
        wrapper.setData({
          exercise: exerciseData,
        });
        wrapper.vm.save();
      });

      it('dispatches `exerciseDocument/save` Vuex action', () => {
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
        const dispatchedAction = mockStore.dispatch.mock.calls[0][0];
        expect(dispatchedAction).toBe('exerciseDocument/save');
      });

      it('with the expected save payload', () => {
        const dispatchedPayload = mockStore.dispatch.mock.calls[0][1];
        expect(dispatchedPayload).toEqual(expect.objectContaining(exerciseData));
      });

      it('navigates to the next page of the create journey', () => {
        expect(mockRouter.push).toHaveBeenCalledWith(mockStore.getters['exerciseCreateJourney/nextPage']);
      });
    });
  });
});
