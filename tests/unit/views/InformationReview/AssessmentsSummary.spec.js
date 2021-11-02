const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};
  
const mockApplication = {
  userId: '0123456',
};

const mockProps = {
  editable: false,
  application: mockApplication,
  exercise: mockExercise,
};

import AssessmentsSummary from '@/views/InformationReview/AssessmentsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/Exercise/Applications/Application', () => {
  describe('template', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = createTestSubject(AssessmentsSummary, {
        propsData: mockProps,
        mocks: {
          $store: {
            getters: {
              'application/data': jest.fn(() => mockApplication),
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
          },
        },
        stubs: [],
      });
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

  });
});
