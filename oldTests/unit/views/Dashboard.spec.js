// import { createStore } from 'vuex';
// import { shallowMount } from '@vue/test-utils';

// import Exercises from '@/views/Exercises';
// import { vi, beforeEach, it } from 'vitest';

// /**
// * @vitest-environment jsdom
// */

// const mockRouter = {
//   push: vi.fn(),
// };

// const exerciseCollection = {
//   namespaced: true,
//   actions: {
//     bind: vi.fn(),
//   },
//   state: {
//     records: [],
//   },
// };

// const store = createStore({
//   state() {
//     return { count: 1 };
//   },
// });

// const createTestSubject = shallowMount(Exercises, {
//   global: {
//     plugins: [store],
//     mocks: {
//       $router: mockRouter,
//     },
//   },
// });

// describe.skip('views/Exercises', () => {
//   describe('template', () => {
//     let wrapper;
//     beforeEach(() => {
//       wrapper = createTestSubject();
//     });

//     it('renders the component', () => {
//       expect(wrapper.exists()).toBe(true);
//     });

//     it('contains the link to ExerciseNew Exercise page', () => {
//       expect(wrapper.find({ ref: 'linkToNewExercise' }).isVisible()).toBe(true);
//     });

//     it('contains a <h1> element', () => {
//       expect(wrapper.find('h1')).toBe(true);
//     });
//   });

//   describe('lifecycle hooks', () => {
//     describe('created', () => {
//       it('loads the exercises collection using Vuex', () => {
//         exerciseCollection.actions.bind.mockReset();
//         createTestSubject();
//         expect(exerciseCollection.actions.bind).toHaveBeenCalledTimes(1);
//       });
//     });
//   });
// });

import { describe, it } from 'vitest';

describe.skip('views/Exercises', () => {
  it('renders', () => {

  });
});
