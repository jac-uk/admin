import ShowTimeline from '@/views/Exercises/Show/Timeline';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Timeline from '@/components/Page/Timeline';

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  applicationOpenDate: 'TestOpen',
  applicationCloseDate: 'TestClose',
};

const store = new Vuex.Store({
  modules: {
    exerciseDocument: {
      namespaced: true,
      state: {
        record: exercise,
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(ShowTimeline, {
    store,
    localVue,
    stubs: {
      'RouterLink': true,
    },
  });
};

describe('@/views/Exercises/Show/Timeline', () => {
  describe('template', () => {
    it('renders Timeline component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find(Timeline).exists()).toBe(true);
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

    describe('timeline', () => {
      it('returns an array', () => {
        let wrapper = createTestSubject();
        expect(wrapper.vm.timeline).toBeArray();
      });
    });
  });
});
