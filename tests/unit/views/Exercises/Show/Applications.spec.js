import Applications from '@/views/Exercises/Show/Applications';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(Applications);
};

describe('@/views/Exercises/Show', () => {
  describe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });
  });
});
