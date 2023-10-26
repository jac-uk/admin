import PageNotFound from '@/views/Errors/PageNotFound.vue';
import { shallowMount } from '@vue/test-utils';

describe.skip('@/views/ExerciseNotFound', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PageNotFound);
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('contains h1', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
  });
});
