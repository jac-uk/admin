import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

const mockExercise = {
};

const mockApplication = {
  userId: '0123456',
  personalDetails: {
    firstName: '',
  },
};

const mockProps = {
  editable: false,
  personalDetails: mockApplication.personalDetails,
};

const mockStore = {
  dispatch: jest.fn(),
  getters: {
    'application/update': jest.fn((obj) => { return { ...mockApplication.personalDetails, ...obj }; }),
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
    wrapper = createTestSubject(PersonalDetailsSummary, {
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
        firstName: 'test',
      };
      wrapper.vm.changeUserDetails(obj);
    });

    it('changeUserDetails', () => {
      expect(wrapper.emitted().update).toBeTruthy();
    });

    it('dispatches formatted change', () => {
      expect(wrapper.emitted().update[0][0]).toEqual({ firstName: 'test' });
    });
  });
});
