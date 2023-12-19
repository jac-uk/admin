import Shortlisting from '@/views/Exercise/Details/Shortlisting/View.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { describe, it } from 'vitest';

const exercise = {
  exerciseMailbox: 'test@jac.co.uk',
  seniorSelectionExerciseManager: 'Iona Wainwright',
  selectionExerciseManager: 'Sierra Mcmillan',
};

const store = createStore({
  modules: {
    exerciseDocument: {
      namespaced: true,
      state: {
        record: exercise,
      },
      getters: {
        data: () => () => exercise,
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(Shortlisting, {
    global: {
      plugins: [store],
      stubs: {
        'RouterLink': true,
      },
    },
  });
};

describe.skip('@/views/Exercise/Show', () => {
  describe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });

    it('renders the router-link', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('RouterLink-stub').exists()).toBe(true);
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        const wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });
  });
});
