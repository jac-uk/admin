import ExerciseNew from '@/views/Exercises/New';
import { shallowMount } from '@vue/test-utils';
import BackLink from '@/components/BackLink';

const mockStore = {
  dispatch: jest.fn(),
  getters: {
    'exerciseCreateJourney/nextPage': { name: 'mock-next-page' },
  },
  state: {
    auth: {
      currentUser: {
        email: 'test@test.test',
      },
    },
  },  
};

const mockRouter = {
  push: jest.fn(),
};

xdescribe('views/Exercises/New', () => {
  let wrapper;
  beforeEach(() => {
    mockStore.dispatch.mockClear();
    mockRouter.push.mockClear();

    wrapper = shallowMount(ExerciseNew, {
      mocks: {
        $store: mockStore,
        $router: mockRouter,
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

    it('renders BackLink component', () => {
      expect(wrapper.find(BackLink).exists()).toBe(true);
    });
  });

  describe('methods', () => {
    describe('save', () => {
      beforeEach(() => {
        wrapper.setData({
          exerciseName: 'Example exercise title',
          addMoreInfoSelection: [
            'contacts',
            'timeline',
            'vacancy',
          ],
        });
      });

      it('dispatches `exerciseDocument/create` Vuex action with the expected save payload', async () => {
        await wrapper.vm.save();
        const expectedPayload = {
          name: 'Example exercise title',
          exerciseMailbox: 'test@test.test',
        };
        const [action, payload] = mockStore.dispatch.mock.calls[0];
        expect(action).toBe('exerciseDocument/create');
        expect(payload).toEqual(expectedPayload);
      });

      describe('when "Add more info?" is true', () => {
        beforeEach(() => {
          wrapper.setData({
            addMoreInfo: true,
            addMoreInfoSelection: ['contacts', 'timeline', 'vacancy'],
          });
        });

        it('begins the create journey by dispatching `exerciseCreateJourney/start` with the selected pages', async () => {
          await wrapper.vm.save();
          const expectedPayload = ['contacts', 'timeline', 'vacancy'];
          const [action, payload] = mockStore.dispatch.mock.calls[1];
          expect(action).toBe('exerciseCreateJourney/start');
          expect(payload).toEqual(expectedPayload);
        });
      });

      describe('when "Add more info?" is false', () => {
        beforeEach(() => {
          wrapper.setData({
            addMoreInfo: false,
          });
        });

        it('clears the create journey by dispatching `exerciseCreateJourney/start` with an empty array', async () => {
          await wrapper.vm.save();
          const [action, payload] = mockStore.dispatch.mock.calls[1];
          expect(action).toBe('exerciseCreateJourney/start');
          expect(payload).toEqual([]);
        });
      });

      it('navigates to the next page of the create journey', async () => {
        await wrapper.vm.save();
        expect(mockRouter.push).toHaveBeenCalledWith(mockStore.getters['exerciseCreateJourney/nextPage']);
      });
    });
  });
});
