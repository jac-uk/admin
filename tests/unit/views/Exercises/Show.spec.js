import Show from '@/views/Exercise.vue';
//import { shallowMount, createLocalVue } from '@vue/test-utils';
import { shallowMount } from '@vue/test-utils';

//import Vuex from 'vuex';
import { createStore } from 'vuex';

import Navigation from '@jac-uk/jac-kit/draftComponents/Navigation.vue';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import AddToFavouritesButton from '@jac-uk/jac-kit/draftComponents/AddToFavouritesButton.vue';
import { vi, describe, beforeEach, it } from 'vitest';

/**
* @vitest-environment jsdom
*/

// const localVue = createLocalVue();
// localVue.use(Vuex);

const exercise = {
  name: 'test name',
};

// const mockStore = {
//   dispatch: vi.fn().mockResolvedValue(),
//   state: {
//     exerciseDocument: {
//       record: exercise,
//     },
//   },
// };

const mockStore = createStore({
  dispatch: vi.fn().mockResolvedValue(),
  state: {
    exerciseDocument: {
      record: exercise,
    },
  },
});

const mockRoute = {
  name: 'name-of-current-route',
  params: {
    id: 'abc123',
  },
};

const mockRouter = {
  replace: vi.fn(),
};

const createTestSubject = () => {
  return shallowMount(Show, {
    // localVue,
    // mocks: {
    //   $route: mockRoute,
    //   $router: mockRouter,
    //   $store: mockStore,
    // },
    // stubs: {
    //   'RouterView': true,
    //   'RouterLink': true,
    // },
    global: {
      //localVue,
      plugins: [mockStore],
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
        $store: mockStore,
      },
      stubs: {
        'RouterView': true,
        'RouterLink': true,
      },
    },
  });
};

describe.skip('@/views/Exercise/Show', () => {

  beforeEach(() => {
    mockStore.dispatch.mockClear();
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        const wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });
  });

  describe('template', () => {
    describe('when loaded is false', () => {
      it('renders LoadingMessage component', () => {
        const wrapper = createTestSubject();
        expect(wrapper.find(LoadingMessage).exists()).toBe(true);
      });

      it('does not render the RouterView', () => {
        const wrapper = createTestSubject();
        expect(wrapper.find('RouterView-stub').exists()).toBe(false);
      });
    });

    describe('when loaded is true', () => {
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

  describe('methods', () => {
    describe('redirectToErrorPage', () => {
      it('calls router replace method with the name of error page', () => {
        const wrapper = createTestSubject();
        wrapper.vm.redirectToErrorPage();
        expect(mockRouter.replace).toHaveBeenCalled();
        expect(mockRouter.replace.mock.calls[0][0]).toEqual({ 'name': 'exercise-not-found' });
      });
    });
  });
});
