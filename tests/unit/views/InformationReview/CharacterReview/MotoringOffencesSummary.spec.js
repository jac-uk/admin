const mockExercise = {
};

const mockApplication = {
  userId: '0123456',
  characterInformation: {
    recentDrivingConvictionDetails: [
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

import MotoringOffencesSummary from '@/views/InformationReview/CharacterReview/MotoringOffencesSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/InformationReview/CharacterReview/MotoringOffencesSummary.vue', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = createTestSubject(MotoringOffencesSummary, {
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

    let obj = {
      field: 'recentDrivingConvictionDetails',
      index: 1,
      change: {
          title: '',
          details: '',
          date: new Date(),
      },
    };

    it('change info', () => {
      wrapper.vm.changeCharacterInfo(obj);
      expect(wrapper.emitted().changeCharacterInfo).toBeTruthy();
    });

    it('add item', () => {
      wrapper.vm.changeCharacterInfo(obj);
      expect(wrapper.emitted().changeCharacterInfo[1][0][obj.field][obj.index]).toEqual(obj.change);
    });

    it('update item', () => {
      obj = {
        field: 'recentDrivingConvictionDetails',
        change: 'Test',
        index: 0, 
        extension: 'title',
      };
      wrapper.vm.changeCharacterInfo(obj);
      expect(wrapper.emitted().changeCharacterInfo[2][0][obj.field][obj.index][obj.extension]).toEqual(obj.change);
    });

    it('Remove item', () => {
      obj = {
        field: 'recentDrivingConvictionDetails',
        index: 0,
        remove: true,
      };
      wrapper.vm.changeCharacterInfo(obj);
      expect(wrapper.emitted().changeCharacterInfo[3][0][obj.field][obj.index]).toEqual();
    });

  });
});
