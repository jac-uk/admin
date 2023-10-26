//import Vuex from 'vuex';
//import { shallowMount, createLocalVue } from '@vue/test-utils';
import Exercises from '@/views/Exercises.vue';
//import Router from 'vue-router';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';

// const localVue = createLocalVue();
// localVue.use(Vuex);
// localVue.use(Router);

const exerciseCollection = {
  namespaced: true,
  actions: {
    bind: vi.fn(),
  },
  state: {
    records: [],
  },
};

// const store = new Vuex.Store({
//   modules: {
//     exerciseCollection,
//   },
// });

const createTestSubject = () => {
  // return shallowMount(Exercises, {
  //   store,
  //   localVue,
  // });

  return mount(Exercises, {
    shallow: true,
    global: {
      stubs: ['RouterView'],
    },
  });
};

describe.skip('views/Exercises', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('contains the link to ExerciseNew Exercise page', () => {
      expect(wrapper.find({ ref: 'linkToNewExercise' }).isVisible()).toBe(true);
    });

    it('contains a <h1> element', () => {
      expect(wrapper.find('h1')).toBe(true);
    });
  });

  describe('lifecycle hooks', () => {
    describe('created', () => {
      it('loads the exercises collection using Vuex', () => {
        exerciseCollection.actions.bind.mockReset();
        createTestSubject();
        expect(exerciseCollection.actions.bind).toHaveBeenCalledTimes(1);
      });
    });
  });
});
