import ExerciseReports from '@/views/Exercise/Reports.vue';
//import { shallowMount, createLocalVue } from '@vue/test-utils';
import { shallowMount } from '@vue/test-utils';
//import Router from 'vue-router';
import { vi, describe, it } from 'vitest';

// const localVue = createLocalVue();
// localVue.use(Router);

const mockRouter = {
  push: vi.fn(),
};

describe.skip('views/Exercise/Reports', () => {
  it('renders the component', () => {
    // const wrapper = shallowMount(ExerciseReports, {
    //   localVue,
    // });

    const wrapper = shallowMount(ExerciseReports, {
      global: {
        mocks: {
          $router: mockRouter,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

});
