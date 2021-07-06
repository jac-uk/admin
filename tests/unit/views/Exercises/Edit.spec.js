import Edit from '@/views/Exercise';
import { shallowMount } from '@vue/test-utils';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';

const mockStore = {
  dispatch: jest.fn().mockResolvedValue(),
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
  return shallowMount(Edit, {
    mocks: {
      $store: mockStore,
      $route: mockRoute,
      $router: mockRouter,
    },
    stubs: {
      RouterView: true,
    },
  });
};

xdescribe('@/views/Exercise/Edit', () => {
  let wrapper;
  beforeEach(() => {
    mockStore.dispatch.mockClear();
    wrapper = createTestSubject();
  });

  describe('template', () => {
    describe('when loaded is false', () => {
      beforeEach(() => {
        wrapper.setData({ loaded: false });
      });

      it('renders LoadingMessage component', () => {
        expect(wrapper.find(LoadingMessage).exists()).toBe(true);
      });

      it('does not render the child page', () => {
        expect(wrapper.find('RouterView-stub').exists()).toBe(false);
      });
    });

    describe('when loaded is true', () => {
      beforeEach(() => {
        wrapper.setData({ loaded: true });
      });

      it('does not render LoadingMessage component', () => {
        expect(wrapper.find(LoadingMessage).exists()).toBe(false);
      });

      it('renders the child page', () => {
        expect(wrapper.find('RouterView-stub').exists()).toBe(true);
      });
    });
  });

  describe('lifecycle hooks', () => {
    describe('mounted', () => {
      it('loads the exercise document identified by URL param `id`', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('exerciseDocument/bind', 'abc123');
      });

      it('updates `exerciseCreateJourney` with the current route name', () => {
        expect(mockStore.dispatch).toHaveBeenCalledWith('exerciseCreateJourney/setCurrentRoute', wrapper.vm.$route.name);
      });
    });
  });

  describe('watchers', () => {
    describe('when $route changes', () => {
      it('updates `exerciseCreateJourney` with the current route name', () => {
        // Trigger the $route watcher function
        const watcher = wrapper.vm.$options.watch.$route;
        const callWatcher = (newValue, oldValue) => (watcher.call(wrapper.vm, newValue, oldValue));

        // Reset dispatch mock so it doesn't count calls made during mounted()
        mockStore.dispatch.mockClear();

        callWatcher({ name: 'page-one' });
        callWatcher({ name: 'page-two' });

        expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
        const calls = mockStore.dispatch.mock.calls;
        expect(calls[0]).toEqual(['exerciseCreateJourney/setCurrentRoute', 'page-one']);
        expect(calls[1]).toEqual(['exerciseCreateJourney/setCurrentRoute', 'page-two']);
      });
    });
  });

  describe('methods', () => {
    describe('redirectToErrorPage', () => {
      it('calls router replace method with the name of error page', () => {
        wrapper.vm.redirectToErrorPage();
        expect(mockRouter.replace).toHaveBeenCalled();
        expect(mockRouter.replace.mock.calls[0][0]).toEqual({ 'name': 'exercise-not-found' });
      });
    });
  });
});
