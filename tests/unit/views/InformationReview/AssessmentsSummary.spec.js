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
    'application/update': jest.fn((obj) => { return { ...mockApplication.selectionCriteriaAnswers, ...obj }; } ),
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

import AssessmentsSummary from '@/views/InformationReview/AssessmentsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

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
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalled();
    });
    
    it('dispatches `application/update` Vuex action', () => {
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const dispatchedAction = mockStore.dispatch.mock.calls[0][0];
      expect(dispatchedAction).toBe('application/update');
    });
    
    it('dispatches formatted change', () => {
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      const dispatchedChange = mockStore.dispatch.mock.calls[0][1];
      expect(dispatchedChange).toEqual( { data: { selectionCriteriaAnswers: { 0: { answer: true } }, userId: '0123456' }, id: 'application1' } );
    });

  });
});

