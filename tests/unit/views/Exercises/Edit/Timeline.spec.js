import ExerciseEditTimeline from '@/views/Exercises/Edit/Timeline';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/Edit/Timeline', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(ExerciseEditTimeline, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('contains the link to About The Vacancy page', () => {
    let wrapper = shallowMount(ExerciseEditTimeline, {
      localVue,
    });
    expect(wrapper.find({ ref: 'linkToAboutTheVacancy' }).isVisible()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(ExerciseEditTimeline, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
