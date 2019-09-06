import ExerciseEditEligibility from '@/views/Exercises/Edit/Eligibility';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Edit/Eligibility', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(ExerciseEditEligibility, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExerciseEditEligibility, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
