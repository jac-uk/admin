import DryRun from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/DryRun.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

describe('DryRun.vue', () => {
    const wrapper = createTestSubject(DryRun, {
      propsData: {},
      mocks: {},
      stubs: [],
    });
  it('renders successfully', () => {
      console.log(wrapper.html());
      expect(wrapper.exists()).toBe(true);
    });

  it.only('renders successfully', () => {
    wrapper.vm.invitedEmailsText = [1, 2];
    console.log(wrapper.vm.invitedEmailsText);
    expect(wrapper.exists()).toBe(true);
  });
});

