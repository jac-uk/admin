import ExerciseEditAbout from '@/views/Exercises/Edit/About';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Edit/About', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(ExerciseEditAbout, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
  it('contains the link to the Add Eligibility Information page', () => {
    let wrapper = shallowMount(ExerciseEditAbout, {
      localVue,
    });
    expect(wrapper.find({ ref: 'linkToAddEligibilityInformation' }).isVisible()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExerciseEditAbout, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
