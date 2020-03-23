import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Dashboard from '@/views/Dashboard';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router);

const exerciseCollection = {
  namespaced: true,
  actions: {
    bind: jest.fn(),
  },
  state: {
    records: [],
  },
};

const store = new Vuex.Store({
  modules: {
    exerciseCollection,
  },
});

const createTestSubject = () => {
  return shallowMount(Dashboard, {
    store,
    localVue,
  });
};

xdescribe('views/Dashboard', () => {
  xdescribe('template', () => {
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
      expect(wrapper.contains('h1')).toBe(true);
    });
  });

  xdescribe('lifecycle hooks', () => {
    xdescribe('created', () => {
      it('loads the exercises collection using Vuex', () => {
        exerciseCollection.actions.bind.mockReset();
        createTestSubject();
        expect(exerciseCollection.actions.bind).toHaveBeenCalledTimes(1);
      });
    });
  });
});
