import AssessmentsSummary from '@/views/InformationReview/AssessmentsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};

const mockApplication = {
  userId: '0123456',
  selectionCriteriaAnswers: [],
};

const mockProps = {
  editable: false,
  application: mockApplication,
  exercise: mockExercise,
};

const mockStore = {
  dispatch: jest.fn(),
  getters: {
    'application/update': jest.fn((obj) => { return { ...mockApplication.selectionCriteriaAnswers, ...obj }; }),
  },
  state: {
    exerciseDocument: {
      record: mockExercise,
    },
    applications: {
      records: [mockApplication],
    },
    application: {
      record: mockApplication,
    },
  },
};

describe('@/views/Exercise/Applications/Application', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(AssessmentsSummary, {
      propsData: mockProps,
      mocks: {
        $store: mockStore,
      },
      stubs: [],
    });
  });
  describe('template', () => {
    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('methods', () => {
    beforeAll(() => {
      const obj = {
        field: 'selectionCriteriaAnswers',
        change: true,
        index: 0,
        extension: 'answer',
      };
      wrapper.vm.changeAssessmentInfo(obj);
    });

    it('changeUserDetails', () => {
      expect(wrapper.emitted().updateApplication).toBeTruthy();
    });

    it('dispatches formatted change', () => {
      expect(wrapper.emitted().updateApplication[0][0]).toEqual({ selectionCriteriaAnswers: { 0: { answer: true } } });
    });
  });
});

