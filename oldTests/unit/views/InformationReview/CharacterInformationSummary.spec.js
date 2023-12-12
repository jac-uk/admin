// import { vi, describe, it, beforeAll } from 'vitest';

// /**
// * @vitest-environment jsdom
// */

// const mockExercise = {
// };

// const mockApplication = {
//   userId: '0123456',
//   characterInformation: {
//     _versionNumber: 2,
//     furtherInformationDetails: '',
//   },
// };

// const mockProps = {
//   editable: false,
//   characterInformation: mockApplication.characterInformation,
//   version: 2,
// };

// const mockStore = {
//   dispatch: vi.fn(),
//   getters: {
//     'application/update': vi.fn((obj) => { return { ...mockApplication.characterInformation, ...obj }; } ),
//     'auth/hasPermissions': vi.fn(() => true),
//   },
//   state: {
//     exerciseDocument: {
//       record: mockExercise,
//     },
//     applications: {
//       records: [mockApplication],
//     },
//     application: {
//       record: mockApplication,
//     },
//   },
// };

// import CharacterInformationSummary from '@/views/InformationReview/CharacterInformationSummary.vue';
// import { createTestSubject } from '@/../tests/unit/helpers';

// describe('@/views/Exercise/Applications/Application', () => {
//   let wrapper;
//   beforeAll(() => {
//     wrapper = createTestSubject(CharacterInformationSummary, {
//       propsData: mockProps,
//       mocks: {
//         $store: mockStore,
//       },
//       stubs: [],
//     });
//   });

//   it('renders the component', () => {
//     expect(wrapper.exists()).toBe(true);
//   });

//   describe('methods', () => {
//     beforeAll(() => {
//       const obj = {
//         furtherInformationDetails: 'test',
//       };
//       wrapper.vm.changeCharacterInfo(obj);
//     });

//     it('changeUserDetails', () => {
//       expect(wrapper.emitted().updateApplication).toBeTruthy();
//     });

//     it('dispatches formatted change', () => {
//       expect(wrapper.emitted().updateApplication[0][0]).toEqual( { characterInformationV2: { _versionNumber: 2, furtherInformationDetails: 'test' } } );
//     });

//   });
// });

import { describe, it } from 'vitest';

describe.skip('@/views/Exercise/Applications/Application', () => {
  it('renders', () => {

  });
});
