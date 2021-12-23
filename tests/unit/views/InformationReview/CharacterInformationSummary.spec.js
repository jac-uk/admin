const mockExercise = {
};

const mockApplication = {
  userId: '0123456',
  characterInformation: {
    _versionNumber: 2,
    furtherInformationDetails: '',
  },
};

const mockProps = {
  editable: false,
  characterInformation: mockApplication.characterInformation,
};

const mockStore = {
  dispatch: jest.fn(),
  getters: {
    'application/update': jest.fn((obj) => { return { ...mockApplication.characterInformation, ...obj }; } ),
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

import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/Exercise/Applications/Application', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(CharacterInformationSummary, {
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
        furtherInformationDetails: 'test',
      };
      wrapper.vm.changeCharacterInfo(obj);
    });

    it('changeUserDetails', () => {
      expect(wrapper.emitted().updateApplication).toBeTruthy();
    });
    
    it('dispatches formatted change', () => {
      expect(wrapper.emitted().updateApplication[0][0]).toEqual( { characterInformationV2: { _versionNumber: 2, furtherInformationDetails: 'test' } } );
    });

  });
});
