import EditName from '@/views/Exercises/Edit/EditName';
import { shallowMount } from '@vue/test-utils';

const exercise = {
  name: 'TestName',
};

const mockStore = {
  dispatch: jest.fn(),
  state: {
    exerciseDocument: {
      record: {},
    },
  },
  getters: {
    'exerciseDocument/data': () => exercise,
  },
};

const mockRouter = {
  push: jest.fn(),
};

const createTestSubject = () => {
  return shallowMount(EditName, {
    mocks: {
      $store: mockStore,
      $router: mockRouter,
    },
  });
};

xdescribe('@/views/Exercises/Edit/EditName', () => {
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

    it('the <form> contains a "Update exercise name" submit button', () => {
      const button = wrapper.find('form button');
      expect(button.element.type).toBe('submit');
      expect(button.text()).toBe('Update exercise name');
    });
  });

  describe('methods', () => {
    describe('save', () => {
      const exerciseData = {
        name: 'NewName',
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

      it('navigates to the Details overview page', () => {
        expect(mockRouter.push).toHaveBeenCalledWith({ 'name': 'exercise-show-overview' });
      });
    });
  });
});
