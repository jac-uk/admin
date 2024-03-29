const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};

const mockApplicationId = '012345';

const mockApplication = {
  userId: '0123456',
};

const mockProps = {
  editable: false,
  application: mockApplication,
  exercise: mockExercise,
  applicationId: mockApplicationId,
};

import AssessorsSummary from '@/views/InformationReview/AssessorsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';
import { vi, describe, it, beforeAll } from 'vitest';

/**
* @vitest-environment jsdom
*/

describe('@/views/Exercise/Applications/Application', () => {
  describe('template', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = createTestSubject(AssessorsSummary, {
        propsData: mockProps,
        mocks: {
          $store: {
            getters: {
              'application/data': vi.fn(() => mockApplication),
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
