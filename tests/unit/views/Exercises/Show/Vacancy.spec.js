import Vacancy from '@/views/Exercises/Show/Vacancy';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  typeOfExercise: 'testType',
  isCourtOrTribunal: 'Court',
  appointmentType: 'test',
};

const store = new Vuex.Store({
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
    store,
    localVue,
    stubs: {
      'RouterLink': true,
    },
  });
};

describe('@/views/Exercises/Show', () => {
  describe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('dl').exists()).toBe(true);
    });

    it('renders the router-link', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('RouterLink-stub').exists()).toBe(true);
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        let wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });
  });
});
