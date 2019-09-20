import Overview from '@/views/Exercises/Show/Overview';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Timeline from '@/components/Page/Timeline';

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  immediateStart: '56',
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
      getters: {
        data: () => () => exercise,
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(Overview, {
    store,
    localVue,
  });
};

describe('@/views/Exercises/Show', () => {
  describe('template', () => {
    it('renders Timeline component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find(Timeline).exists()).toBe(true);
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

      it('uses applicationOpenDate and applicationCloseDate values to build an array', () => {
        let wrapper = createTestSubject();
        expect(wrapper.vm.timeline[0].date).toBe('TestOpen');
        expect(wrapper.vm.timeline[1].date).toBe('TestClose');
      });
    });
  });
});
