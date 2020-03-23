import Show from '@/views/Exercises/Show';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Navigation from '@/components/Page/Navigation';
import LoadingMessage from '@/components/LoadingMessage';
import AddToFavouritesButton from '@/components/Page/AddToFavouritesButton';

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  name: 'test name',
};

let mockStore = {
  dispatch: jest.fn().mockResolvedValue(),
  state: {
    exerciseDocument: {
      record: exercise,
    },
  },
};

const mockRoute = {
  name: 'name-of-current-route',
  params: {
    id: 'abc123',
  },
};

const mockRouter = {
  replace: jest.fn(),
};

const createTestSubject = () => {
  return shallowMount(Show, {
    localVue,
    mocks: {
      $route: mockRoute,
      $router: mockRouter,
      $store: mockStore,
    },
    stubs: {
      'RouterView': true,
      'RouterLink': true,
    },
  });
};

xdescribe('@/views/Exercises/Show', () => {

  beforeEach(() => {
    mockStore.dispatch.mockClear();
  });

  xdescribe('computed properties', () => {
    xdescribe('exercise', () => {
      it('returns record object from state', () => {
        let wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });
  });

  xdescribe('template', () => {
    xdescribe('when loaded is false', () => {
      it('renders LoadingMessage component', () => {
        let wrapper = createTestSubject();
        expect(wrapper.find(LoadingMessage).exists()).toBe(true);
      });

      it('does not render the RouterView', () => {
        let wrapper = createTestSubject();
        expect(wrapper.find('RouterView-stub').exists()).toBe(false);
      });
    });

    xdescribe('when loaded is true', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = createTestSubject();
        wrapper.setData({ loaded: true });
      });

      it('does not render LoadingMessage component', () => {
        expect(wrapper.find({ ref: 'loadingMessageComponent' }).exists()).toBe(false);
      });

      it('renders the Navigation component', () => {
        expect(wrapper.find(Navigation).exists()).toBe(true);
      });

      it('renders the AddToFavouritesButton component', () => {
        expect(wrapper.find(AddToFavouritesButton).exists()).toBe(true);
      });

      it('renders the RouterView', () => {
        expect(wrapper.find('RouterView-stub').exists()).toBe(true);
      });

      it('renders the RouterLink', () => {
        expect(wrapper.find('RouterLink-stub').exists()).toBe(true);
      });
    });
  });

  xdescribe('methods', () => {
    xdescribe('redirectToErrorPage', () => {
      it('calls router replace method with the name of error page', () => {
        let wrapper = createTestSubject();
        wrapper.vm.redirectToErrorPage();
        expect(mockRouter.replace).toHaveBeenCalled();
        expect(mockRouter.replace.mock.calls[0][0]).toEqual({ 'name': 'exercise-not-found' });
      });
    });
  });
});
