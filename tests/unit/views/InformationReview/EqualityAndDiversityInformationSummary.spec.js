import EqualityAndDiversityInformationSummary from '@/views/InformationReview/EqualityAndDiversityInformationSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

const mockExercise = {
  yesSalaryDetails: 'yesSalaryDetails',
  additionalWorkingPreferences: [],
};

const mockApplication = {
  userId: '0123456',
  equalityAndDiversitySurvey: {

  },
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
  equalityAndDiversitySurvey: mockApplication.equalityAndDiversitySurvey,
};

describe('@/views/Exercise/Applications/Application', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(EqualityAndDiversityInformationSummary, {
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
        professionalBackground: 'barrister',
      };
      wrapper.vm.changeEqualityAndDiversityInformation(obj);
    });

    it('changeUserDetails', () => {
      expect(wrapper.emitted().updateApplication).toBeTruthy();
    });

    it('dispatches formatted change', () => {
      expect(wrapper.emitted().updateApplication[0][0]).toEqual({ equalityAndDiversitySurvey: { professionalBackground: 'barrister' } });
    });
  });
});
