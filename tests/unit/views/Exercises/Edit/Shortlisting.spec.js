import ExerciseEditShortlisting from '@/views/Exercises/Edit/Shortlisting';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Edit/Shortlisting', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(ExerciseEditShortlisting, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExerciseEditShortlisting, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
