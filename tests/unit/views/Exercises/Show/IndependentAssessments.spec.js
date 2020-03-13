import IndependentAssessments from '@/views/Exercises/Show/IndependentAssessments';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(IndependentAssessments);
};

xdescribe('@/views/Exercises/Show', () => {
  xdescribe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });
  });
});
