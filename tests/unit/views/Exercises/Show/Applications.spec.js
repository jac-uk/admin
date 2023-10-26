// import Applications from '@/views/Exercise/Applications/List.vue';
// // import { shallowMount, createLocalVue } from '@vue/test-utils';
// import { createTestSubject } from '@/../tests/unit/helpers';
// import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
// import { vi } from 'vitest';

// const mockExercise = {
//   exerciseRef: 'mock exercise',
//   immediateStart: '56',
//   applicationOpenDate: 'TestOpen',
//   applicationCloseDate: 'TestClose',
//   typeOfExercise: 'legal',
//   _applications: {
//     draft: 100,
//     applied: 100,
//     withdrawn: 100,
//   },
// };

// const mockApplication = {
//   referenceNumber: 'mock ref 1',
//   status: 'mock status 1',
//   personalDetails: {
//     name: 'mock name 1',
//     email: 'mock@email.one',
//     phone: '0987654321',
//     dateOfBirth: '',
//   },
//   characterInformation: {
//   },
//   equalityAndDiversitySurvey: {
//     gender: 'female',
//     disability: false,
//     ethnicGroup: 'white-black-african',
//     currentLegalRole: [
//       'barrister',
//       'other-current-legal-role',
//     ],
//     otherCurrentLegalRoleDetails: 'mock role details',
//   },
//   qualifications: [
//     {
//       date: new Date(),
//       location: 'england-wales',
//       type: 'barrister',
//     },
//   ],
//   firstAssessorFullName: 'mock assessor 1 name',
//   firstAssessorEmail: 'mock assessor 1 email',
//   firstAssessorPhone: 'mock assessor 1 phone',
//   SecondAssessorName: 'mock assessor 2 name',
//   SecondAssessorEmail: 'mock@email.two',
//   SecondAssessorPhone: '0123456789',
// };

// const mockProps = {
//   exercise: {
//     id: 'mockid',
//   },
//   status: 'draft',
//   activeTab: 'panel',
// };

// describe('@/views/Exercise/Show/Applications', () => {
//   let wrapper;
//   beforeEach(() => {
//     wrapper = createTestSubject(Applications, {
//       propsData: mockProps,
//       mocks: {
//         $store: {
//           getters: {
//             'application/data': vi.fn(() => mockApplication),
//             'auth/hasPermissions': vi.fn(() => true),
//           },
//           dispatch: vi.fn(),
//           state: {
//             auth: {
//               currentUser: {
//                 role: 'superadmin',
//                 email: 'test@test.test',
//               },
//             },
//             exerciseDocument: {
//               record: mockExercise,
//             },
//             applications: {
//               records: [mockApplication],
//             },
//             application: {
//               record: mockApplication,
//             },
//           },
//         },
//       },
//       stubs: [],
//     });
//   });
//   describe('template', () => {
//     it('renders the component', () => {
//       expect(wrapper.find('div').exists()).toBe(true);
//     });
//   });

//   describe('methods', () => {
//     describe('exportContacts()', () => {

//       it('is a function', () => {
//         expect(typeof wrapper.vm.exportContacts).toBe('function');
//       });

//       it('calls gatherReportData', async () => {
//         wrapper.vm.gatherReportData = vi.fn();
//         await wrapper.vm.gatherReportData();
//         expect(wrapper.vm.gatherReportData).toHaveBeenCalled();
//       });

//       it.skip('calls downloadXLSX', async () => {
//         const mockReport = 'mock report';
//         const mockTitle = 'Contacts';

//         wrapper.vm.gatherReportData = vi.fn().mockReturnValue(mockReport);

//         await wrapper.vm.exportContacts();

//         expect(downloadXLSX).toHaveBeenCalledWith(mockReport, {
//           title: `${mockExercise.referenceNumber} ${mockTitle}`,
//           sheetName: mockTitle,
//           fileName: `${mockExercise.referenceNumber} - ${mockTitle}.xlsx`,
//         });
//       });
//     });
//   });
// });

it('empty suite', () => {

});
