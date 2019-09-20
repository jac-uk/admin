import Contacts from '@/views/Exercises/Show/Contacts';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  exerciseMailbox: 'test@jac.co.uk',
  seniorSelectionExerciseManager: 'Iona Wainwright',
  selectionExerciseManager: 'Sierra Mcmillan',
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
  return shallowMount(Contacts, {
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
