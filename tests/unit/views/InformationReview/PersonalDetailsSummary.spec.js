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
    application: mockApplication,
  };

  const mockStore = {
    dispatch: jest.fn(),
    getters: {
      'application/update': jest.fn((obj) => { return { ...mockApplication.personalDetails, ...obj }; } ),
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

import PersonalDetailsSummary from '@/views/InformationReview/PersonalDetailsSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

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
      expect(dispatchedChange).toEqual( { 'data': { 'personalDetails': { 'firstName': 'test' } }, 'id': 'application1' } );
    });

  });
});
