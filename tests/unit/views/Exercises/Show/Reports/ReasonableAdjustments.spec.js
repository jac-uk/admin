import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ReasonableAdjustments from '@/views/Exercises/Show/Reports/ReasonableAdjustments';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockExercise = {
  immediateStart: '56',
  applicationOpenDate: 'TestOpen',
  applicationCloseDate: 'TestClose',
};

const mockReport = {
  totalCount: 3,
  candidates: [
    {
      userId: '234',
      name: 'mock name 2',
      email: 'email2@somewhere.com',
      requiresAdjustments: true,
      adjustmentsDetails: 'Indexs sunt quadras de barbatus animalis.',
    }],
};

const reasonableAdjustmentsGetter = jest.fn().mockReturnValue(mockReport);
const store = new Vuex.Store({
  modules: {
    applications: {
      namespaced: true,
      actions: {
        bind: jest.fn(),
      },
      state: {
        records: [],
      },
      getters: {
        reasonableAdjustments: reasonableAdjustmentsGetter,
      },
    },
    exerciseDocument: {
      namespaced: true,
      state: {
        record: mockExercise,
      },
      getters: {
        data: jest.fn().mockReturnValue(mockExercise),
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(ReasonableAdjustments, {
    store,
    localVue,
  });
};

describe('@/views/Exercises/Show/Reports/ReasonableAdjustments', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createTestSubject();
  });

  describe('template', () => {
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('contains a <h1>', () => {
      expect(wrapper.contains('h1')).toBe(true);
    });

  });

  describe('computed properties', () => {

    describe('exercise', () => {
      it('returns record object from state', () => {
        expect(wrapper.vm.exercise).toEqual(mockExercise);
      });
    });
    describe('reasonableAdjustments', () => {
      it('returns generated report object', () => {
        expect(wrapper.vm.reasonableAdjustments).toEqual(mockReport);
      });
    });
  });
});
