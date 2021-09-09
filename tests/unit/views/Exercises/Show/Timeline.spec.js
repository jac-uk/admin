import ShowTimeline from '@/views/Exercise/Details/Timeline/View';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';

jest.mock('@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline', () => {
  return jest.fn().mockImplementation(() => {
    return [];
  });
});

jest.mock('@jac-uk/jac-kit/helpers/Timeline/createTimeline', () => {
  return jest.fn().mockImplementation(() => {
    return [];
  });
});

const localVue = createLocalVue();
localVue.use(Vuex);

const exercise = {
  applicationOpenDate: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  applicationCloseDate: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  sjcaTestStartTime: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  sjcaTestEndTime: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  sjcaTestOutcome: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  scenarioTestDate: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  scenarioTestStartTime: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  scenarioTestEndTime: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  scenarioTestOutcome: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  selectionDays: [{
    selectionDayStart: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
    selectionDayEnd: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  }],
  contactIndependentAssessors: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  characterChecks: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  statutoryConsultation: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
  finalOutcome: new Date('Wed Dec 12 2012 00:00:00 GMT+0000 (Greenwich Mean Time)'),
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
  return shallowMount(ShowTimeline, {
    store,
    localVue,
    stubs: {
      'RouterLink': true,
    },
  });
};

xdescribe('@/views/Exercise/Show/Timeline', () => {
  describe('template', () => {
    it('renders Timeline component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find(Timeline).exists()).toBe(true);
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
    });
  });
});
