const mockExercise = {
};

const mockApplication = {
  userId: '0123456',
  characterInformation: {
    criminalConvictionDetails: [
      {
        title: '',
        details: '',
        date: new Date(),
      },
    ],
  },
};

const mockProps = {
  edit: false,
  application: mockApplication,
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

import CharacterDeclarationSummary from '@/views/InformationReview/CharacterReview/CharacterDeclarationSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/InformationReview/CharacterReview/CharacterDeclarationSummary', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(CharacterDeclarationSummary, {
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
});
