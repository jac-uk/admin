import Overview from '@/views/Exercise/Details/Overview';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import { vi, describe, it, beforeEach } from 'vitest';

vi.mock('@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline', () => {
  return vi.fn().mockImplementation(() => {
    return [];
  });
});

vi.mock('@jac-uk/jac-kit/helpers/Timeline/createTimeline', () => {
  return vi.fn().mockImplementation(() => {
    return [];
  });
});

const exercise = {
  immediateStart: '56',
  applicationOpenDate: 'TestOpen',
  applicationCloseDate: 'TestClose',
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
  // return shallowMount(Overview, {
  //   store,
  //   localVue,
  // });
  return shallowMount(Overview, {
    global: {
      plugins: [store],
    },
  });
};

describe.skip('@/views/Exercise/Show', () => {
  describe('template', () => {
    it('renders Timeline component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find(Timeline).exists()).toBe(true);
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        const wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });

    describe('timeline', () => {
      beforeEach(() => {
        createTestSubject();
      });
      it('calls exerciseTimeline helper', () => {
        expect(exerciseTimeline).toHaveBeenCalled();
      });

      it('calls createTimeline helper', () => {
        expect(createTimeline).toHaveBeenCalled();
      });

      it('calls createTimeline helper with array and passes 2 as length', () => {
        expect(createTimeline).toHaveBeenCalledWith([], 2);
      });
    });
  });
});
