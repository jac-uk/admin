import ExerciseNotFound from '@/views/Errors/ExerciseNotFound.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, beforeEach, it } from 'vitest';

describe.skip('@/views/ExerciseNotFound', () => {
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
