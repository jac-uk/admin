import { shallowMount } from '@vue/test-utils';
import ExerciseEditTimeline from '@/views/Exercises/Edit/Timeline';
import RepeatableFields from '@/components/RepeatableFields';

describe('views/Exercises/Edit/Timeline', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ExerciseEditTimeline);
  });

  it('renders the view', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the link to About The Vacancy page', () => {
    expect(wrapper.find({ ref: 'linkToAboutTheVacancy' }).isVisible()).toBe(true);
  });

  it('renders RepeatableFields component', () => {
    expect(wrapper.find(RepeatableFields).exists()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
