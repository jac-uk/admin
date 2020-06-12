import IndependentAssessments from '@/views/Exercises/Tasks/IndependentAssessments';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(IndependentAssessments);
};

xdescribe('@/views/Exercises/Tasks/IndependentAssessments', () => {
  xdescribe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });
  });
});
