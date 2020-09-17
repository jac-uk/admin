import ExerciseReports from '@/views/Exercises/Reports';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Reports', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(ExerciseReports, {
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      const wrapper = shallowMount(ExerciseReports, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
