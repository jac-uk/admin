import CharacterChecks from '@/views/Exercise/Tasks/CharacterChecks';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(CharacterChecks);
};

xdescribe('@/views/Exercise/Tasks/CharacterChecks', () => {
  xdescribe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('h1').exists()).toBe(true);
    });
  });
});
