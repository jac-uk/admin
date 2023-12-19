import Vacancy from '@/views/Exercise/Details/Vacancy/View.vue';
//import { shallowMount, createLocalVue } from '@vue/test-utils';
import { shallowMount } from '@vue/test-utils';

//import Vuex from 'vuex';
import { createStore } from 'vuex';

import { describe, it } from 'vitest';

// const localVue = createLocalVue();
// localVue.use(Vuex);

const exercise = {
  typeOfExercise: 'testType',
  isCourtOrTribunal: 'Court',
  appointmentType: 'test',
};

// const store = new Vuex.Store({
//   modules: {
//     exerciseDocument: {
//       namespaced: true,
//       state: {
//         record: exercise,
//       },
//       getters: {
//         data: () => () => exercise,
//       },
//     },
//   },
// });

// const createTestSubject = () => {
//   return shallowMount(Vacancy, {
//     store,
//     localVue,
//     stubs: {
//       'RouterLink': true,
//     },
//   });
// };

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
  return shallowMount(Vacancy, {
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
      expect(wrapper.find('dl').exists()).toBe(true);
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
