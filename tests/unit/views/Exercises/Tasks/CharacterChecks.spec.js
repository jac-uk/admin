import CharacterChecks from '@/views/Exercise/Tasks/CharacterChecks.vue';
import { shallowMount } from '@vue/test-utils';

const createTestSubject = () => {
  return shallowMount(CharacterChecks);
};

describe.skip('@/views/Exercise/Tasks/CharacterChecks', () => {
  describe.skip('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('h1').exists()).toBe(true);
    });
  });
});
