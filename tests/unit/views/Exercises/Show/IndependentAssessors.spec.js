import IndependentAssessors from '@/views/Exercises/Show/IndependentAssessors';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(IndependentAssessors);
};

describe('@/views/Exercises/Show', () => {
  describe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });
  });
});
