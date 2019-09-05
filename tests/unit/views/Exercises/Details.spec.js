import ExercisesDetails from '@/views/Exercises/Details';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Details', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(ExercisesDetails, {
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExercisesDetails, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
