// import Overview from '@/views/Exercise/Details/Overview.vue';
// import { shallowMount, createLocalVue } from '@vue/test-utils';
// import Vuex from 'vuex';
// import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline.vue';
// import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline.vue';
// import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline.vue';
// import { vi } from 'vitest';

// vi.mock('@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline', () => {
//   return vi.fn().mockImplementation(() => {
//     return [];
//   });
// });

// vi.mock('@jac-uk/jac-kit/helpers/Timeline/createTimeline', () => {
//   return vi.fn().mockImplementation(() => {
//     return [];
//   });
// });

// const localVue = createLocalVue();
// localVue.use(Vuex);

// const exercise = {
//   immediateStart: '56',
//   applicationOpenDate: 'TestOpen',
//   applicationCloseDate: 'TestClose',
// };

// const store = new Vuex.Store({
//   modules: {
//     exerciseDocument: {
//       namespaced: true,
//       state: {
//         record: exercise,
//       },
//       getters: {
//         data: () => () => exercise,
//       },
//     },
//   },
// });

// const createTestSubject = () => {
//   return shallowMount(Overview, {
//     store,
//     localVue,
//   });
// };

// describe.skip('@/views/Exercise/Show', () => {
//   describe('template', () => {
//     it('renders Timeline component', () => {
//       const wrapper = createTestSubject();
//       expect(wrapper.find(Timeline).exists()).toBe(true);
//     });
//   });

//   describe('computed properties', () => {
//     describe('exercise', () => {
//       it('returns record object from state', () => {
//         const wrapper = createTestSubject();
//         expect(wrapper.vm.exercise).toEqual(exercise);
//       });
//     });

//     describe('timeline', () => {
//       beforeEach(() => {
//         createTestSubject();
//       });
//       it('calls exerciseTimeline helper', () => {
//         expect(exerciseTimeline).toHaveBeenCalled();
//       });

//       it('calls createTimeline helper', () => {
//         expect(createTimeline).toHaveBeenCalled();
//       });

//       it('calls createTimeline helper with array and passes 2 as length', () => {
//         expect(createTimeline).toHaveBeenCalledWith([], 2);
//       });
//     });
//   });
// });

it('empty suite', () => {

});
