import Edit from '@/views/Exercises/Edit';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router);

const router = new Router();

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
    },
  },
});

const createTestSubject = () => {
  return shallowMount(Edit, {
    store,
    localVue,
    router,
  });
};

describe('@/views/Exercises/Edit', () => {
  describe('template', () => {
    describe('when loaded equals to false', () => {
      it('renders LoadingMessage component', () => {
        let wrapper = createTestSubject();
        expect(wrapper.find({ ref: 'loadingMessageComponent' }).exists()).toBe(true);
      });
    });

     describe('when loaded is not  equals to false', () => {
      it('renders LoadingMessage component', () => {
        let wrapper = createTestSubject();
        wrapper.setData({ loaded: 'hello' });
        expect(wrapper.find({ ref: 'loadingMessageComponent' }).exists()).toBe(false);
      });
    });
  });
});
