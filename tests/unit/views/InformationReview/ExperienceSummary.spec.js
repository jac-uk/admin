const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};
  
const mockApplication = {
  userId: '0123456',
};
const mockStore = {
  dispatch: jest.fn(),
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
};
const mockProps = {
  editable: false,
  application: mockApplication,
  exercise: mockExercise,
};

import ExperienceSummary from '@/views/InformationReview/ExperienceSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/Exercise/Applications/Application', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(ExperienceSummary, {
      propsData: mockProps,
      mocks: {
        $store: mockStore,
      },
      stubs: [],
    });
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('methods', () => {
    beforeAll(() => {
      const obj = {
        experience: 'test',
      };
      wrapper.vm.changeInfo(obj);
    });

    it('changeUserDetails', () => {
      expect(wrapper.emitted().updateApplication).toBeTruthy();
    });
    
    it('dispatches formatted change', () => {
      expect(wrapper.emitted().updateApplication[0][0]).toEqual( { experience: 'test', userId: '0123456' } );
    });

  });

});
