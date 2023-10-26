import ExerciseReports from '@/views/Exercise/Reports.vue';
// import { shallowMount, createLocalVue } from '@vue/test-utils';
// import Router from 'vue-router';
import { mount } from '@vue/test-utils';

// const localVue = createLocalVue();
// localVue.use(Router);

describe.skip('views/Exercise/Reports', () => {
  it('renders the component', () => {
    // const wrapper = shallowMount(ExerciseReports, {
    //   localVue,
    // });
    const wrapper = mount(ExerciseReports, {
      shallow: true,
      global: {
        stubs: ['RouterView'],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

});
