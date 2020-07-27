import ExerciseEditShortlisting from '@/views/Exercises/Edit/Shortlisting';
import { shallowMount } from '@vue/test-utils';

const exercise = {
  shortlistingMethods: null,
  otherShortlistingMethod: null,
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

xdescribe('views/Exercises/Edit/Shortlisting', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExerciseEditShortlisting, {
      mocks: {
        $store: mockStore,
        $router: mockRouter,
      },
    });
  });

  xdescribe('template', () => {
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

  xdescribe('methods', () => {
    xdescribe('save', () => {
      const exerciseData = {
        shortlistingMethods: ['method-1'],
        otherShortlistingMethod: [{ name: 'additional method' }],
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
