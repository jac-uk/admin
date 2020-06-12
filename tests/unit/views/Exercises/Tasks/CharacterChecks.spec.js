import CharacterChecks from '@/views/Exercises/Tasks/CharacterChecks';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(CharacterChecks);
};

xdescribe('@/views/Exercises/Tasks/CharacterChecks', () => {
  xdescribe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();
      expect(wrapper.find('h1').exists()).toBe(true);
    });
  });
});
