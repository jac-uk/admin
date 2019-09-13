import Show from '@/views/Exercises/Show';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
import Vuex from 'vuex';
import Navigation from '@/components/Page/Navigation';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router);

const router = new Router();
const exercise = {
  name: 'test name',
};

const store = new Vuex.Store({
  dispatch: jest.fn(),
  modules: {
    exerciseDocument: {
      namespaced: true,
      actions: {
        bind: () => {
          new Promise((resolve) => {
            return resolve();
          });
        },
      },
      state: {
        record: exercise,
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(Show, {
    store,
    localVue,
    router,
  });
};

describe('@/views/Exercises/Show', () => {
  describe('template', () => {
    describe('when loaded is false', () => {
      it('renders LoadingMessage component', () => {
        let wrapper = createTestSubject();
        expect(wrapper.find({ ref: 'loadingMessageComponent' }).exists()).toBe(true);
      });
    });

    describe('when loaded is true', () => {
      it('renders LoadingMessage component', () => {
        let wrapper = createTestSubject();
        wrapper.setData({ loaded: true });
        expect(wrapper.find({ ref: 'loadingMessageComponent' }).exists()).toBe(false);
      });
    });
  });

  describe('Navigation component',() => {
    it('renders', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find(Navigation).exists()).toBe(false);
    });
  });
});
