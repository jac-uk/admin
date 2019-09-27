import ExerciseNotFound from '@/views/Errors/ExerciseNotFound';
import { shallowMount } from '@vue/test-utils';

describe('@/views/ExerciseNotFound', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExerciseNotFound);
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('contains h1', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
  });
});
