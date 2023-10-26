// import Vuex from 'vuex';
// import { shallowMount, createLocalVue } from '@vue/test-utils';
// import ReasonableAdjustments from '@/views/Exercise/Reports/ReasonableAdjustments.vue';
// import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
// import { vi } from 'vitest';

// const localVue = createLocalVue();
// localVue.use(Vuex);

// vi.mock('@jac-uk/jac-kit/helpers/export', () => {
//   return {
//     downloadXLSX: vi.fn(),
//   };
// });

// const mockExercise = {
//   referenceNumber: 'MockRef',
//   immediateStart: '56',
//   applicationOpenDate: 'TestOpen',
//   applicationCloseDate: 'TestClose',
// };

// const store = new Vuex.Store({
//   modules: {
//     applications: {
//       namespaced: true,
//       actions: {
//         bind: vi.fn(),
//       },
//       state: {
//         records: [],
//       },
//     },
//     exerciseDocument: {
//       namespaced: true,
//       state: {
//         record: mockExercise,
//       },
//       getters: {
//         data: vi.fn().mockReturnValue(mockExercise),
//       },
//     },
//     auth: {
//       namespaced: true,
//       getters: {
//         hasPermissions: () => () => true,
//       },
//     },
//   },
// });

// const createTestSubject = () => {
//   return shallowMount(ReasonableAdjustments, {
//     store,
//     localVue,
//   });
// };

// describe('@/views/Exercise/Show/Reports/ReasonableAdjustments', () => {
//   let wrapper;
//   beforeEach(() => {
//     wrapper = createTestSubject();
//   });

//   describe('template', () => {
//     it('renders', () => {
//       expect(wrapper.exists()).toBe(true);
//     });

//     it('contains a <h2>', () => {
//       expect(wrapper.find('h2')).toBeTruthy();
//     });

//   });

//   describe('computed properties', () => {

//     describe('exercise', () => {
//       it('returns record object from state', () => {
//         expect(wrapper.vm.exercise).toEqual(mockExercise);
//       });
//     });

//   });
//   describe('methods', () => {
//     describe('exportData()', () => {

//       it('is a function', () => {
//         expect(typeof wrapper.vm.exportData).toBe('function');
//       });

//       it('calls gatherReportData', () => {
//         wrapper.vm.gatherReportData = vi.fn();
//         wrapper.vm.gatherReportData();
//         expect(wrapper.vm.gatherReportData).toHaveBeenCalled();
//       });

//       it('calls downloadXLSX', () => {
//         const mockReport = 'mock report';
//         const mockTitle = 'Reasonable Adjustments Report';

//         wrapper.vm.gatherReportData = vi.fn().mockReturnValue(mockReport);

//         wrapper.vm.exportData();

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
