import ExerciseNew from '@/views/Exercises/New';
import { shallowMount } from '@vue/test-utils';

const mockStore = {
  dispatch: jest.fn(),
};

describe('views/Exercises/New', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExerciseNew, {
      mocks: {
        $store: mockStore,
      },
    });
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

  describe('methods', () => {
    describe('save', () => {
      beforeEach(() => {
        wrapper.setData({
          exerciseName: 'Example exercise title',
          exerciseType: 'legal',
        });
        wrapper.vm.save();
      });

      it('dispatches `exerciseDocument/create` Vuex action', () => {
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
        const dispatchedAction = mockStore.dispatch.mock.calls[0][0];
        expect(dispatchedAction).toBe('exerciseDocument/create');
      });

      it('with the expected save payload', () => {
        const expectedPayload = {
          name: 'Example exercise title',
          type: 'legal',
        };
        const dispatchedPayload = mockStore.dispatch.mock.calls[0][1];
        expect(dispatchedPayload).toEqual(expectedPayload);
      });
    });
  });
});
