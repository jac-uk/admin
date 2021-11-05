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

import EqualityAndDiversityInformationSummary from '@/views/InformationReview/EqualityAndDiversityInformationSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

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
        expect(dispatchedChange).toEqual( { data: { equalityAndDiversitySurvey: { professionalBackground: 'barrister' } }, id: 'application1' } );
      });
  
    });

});
