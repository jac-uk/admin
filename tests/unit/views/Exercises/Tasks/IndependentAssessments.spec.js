import IndependentAssessments from '@/views/Exercise/Tasks/IndependentAssessments.vue';
import { shallowMount } from '@vue/test-utils';
import { describe, it } from 'vitest';

const createTestSubject = () => {
  return shallowMount(IndependentAssessments);
};

/**
* @vitest-environment jsdom
*/

describe.skip('@/views/Exercise/Show', () => {
  describe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
    });
  });
});
