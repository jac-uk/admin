const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};
  
const mockApplication = {
  userId: '0123456',
  characterInformation: {

  },
};

const mockProps = {
  editable: false,
  application: mockApplication,
  exercise: mockExercise,
  characterInformation: mockApplication.characterInformation,
};

import FinancialMattersAgencyReport from '@/views/InformationReview/FinancialMattersAgencyReport.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/Exercise/Applications/Application', () => {
  describe('template', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = createTestSubject(FinancialMattersAgencyReport, {
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
