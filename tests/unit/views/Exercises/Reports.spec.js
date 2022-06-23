import ExerciseReports from '@/views/Exercise/Reports';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

xdescribe('views/Exercise/Reports', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(ExerciseReports, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
});
