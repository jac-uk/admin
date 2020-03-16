import ExerciseDetails from '@/views/Exercises/Details';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

xdescribe('views/Exercises/Details', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(ExerciseDetails, {
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  xdescribe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExerciseDetails, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
