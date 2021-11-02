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

import CriminalOffencesSummary from '@/views/InformationReview/CharacterReview/CriminalOffencesSummary.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('@/views/Exercise/Applications/Application', () => {
let wrapper;
beforeAll(() => {
  wrapper = createTestSubject(CriminalOffencesSummary, {
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
    field: 'criminalConvictionDetails',
    index: 1,
    change: {
        title: '',
        details: '',
        date: new Date(),
    },
  };

  it('changeUserDetails', () => {
    wrapper.vm.changeCharacterInfo(obj);
    expect(wrapper.emitted().changeCharacterInfo).toBeTruthy();
  });

  it('changeUserDetails: add', () => {
    wrapper.vm.changeCharacterInfo(obj);
    expect(wrapper.emitted().changeCharacterInfo[0][0][obj.field][obj.index]).toEqual(obj.change);
  });

  it('changeUserDetails: update', () => {
    obj = {
      field: 'criminalConvictionDetails',
      change: 'Test',
      index: 0, 
      extension: 'title',
    };
    wrapper.vm.changeCharacterInfo(obj);
    expect(wrapper.emitted().changeCharacterInfo[0][0][obj.field][obj.index][obj.extension]).toEqual(obj.change);
  });

  it('changeUserDetails: remove', () => {
    obj = {
      field: 'criminalConvictionDetails',
      index: 0,
      remove: true,
    };
    wrapper.vm.changeCharacterInfo(obj);
    expect(wrapper.emitted().changeCharacterInfo[0][0][obj.field][obj.index]).toEqual(obj.change);
  });

  // it('dispatches `application/update` Vuex action', () => {
  //   expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  //   const dispatchedAction = mockStore.dispatch.mock.calls[0][0];
  //   expect(dispatchedAction).toBe('application/update');
  // });
  
  // it('dispatches formatted change', () => {
  //   expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  //   const dispatchedChange = mockStore.dispatch.mock.calls[0][1];
  //   expect(dispatchedChange).toEqual( { 'data': { 'characterInformation': { 'firstName': 'test', 'lastName': 'test' } }, 'id': 'application1' } );
  // });

});
});
