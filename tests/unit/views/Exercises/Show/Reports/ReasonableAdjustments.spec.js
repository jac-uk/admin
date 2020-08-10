import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ReasonableAdjustments from '@/views/Exercises/Show/Reports/ReasonableAdjustments';
import { downloadXLSX } from '@/helpers/export';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@/helpers/export', () => {
  return {
    downloadXLSX: jest.fn(),
  };
});

const mockExercise = {
  referenceNumber: 'MockRef',
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

    it('contains a <h2>', () => {
      expect(wrapper.contains('h2')).toBe(true);
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
  describe('methods', () => {
    describe('gatherReportData()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.gatherReportData).toBe('function');
      });

      it('returns an array with header row and one row per application', () => {
        const report = wrapper.vm.gatherReportData();

        expect(report).toBeArrayOfSize(mockReport.candidates.length + 1);
      });

      it('returns an array starting with header row', () => {
        const report = wrapper.vm.gatherReportData();

        const headers = [
          'Name',
          'Email',
          'Phone number',
          'Details',
        ];

        expect(report[0]).toBeArray();
        expect(report[0]).toEqual(headers);
      });
    });

    describe('exportData()', () => {

      it('is a function', () => {
        expect(typeof wrapper.vm.exportData).toBe('function');
      });

      it('calls gatherReportData', () => {
        wrapper.vm.gatherReportData = jest.fn();
        wrapper.vm.exportData();
        expect(wrapper.vm.gatherReportData).toHaveBeenCalled();
      });

      it('calls downloadXLSX', () => {
        const mockReport = 'mock report';
        const mockTitle = 'Reasonable Adjustments Report';

        wrapper.vm.gatherReportData = jest.fn().mockReturnValue(mockReport);

        wrapper.vm.exportData();

        expect(downloadXLSX).toHaveBeenCalledWith(mockReport, {
          title: `${mockExercise.referenceNumber} ${mockTitle}`,
          sheetName: mockTitle,
          fileName: `${mockExercise.referenceNumber} - ${mockTitle}.xlsx`,
        });
      });
    });
  });
});
