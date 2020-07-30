import { shallowMount } from '@vue/test-utils';
import Warning from '@/components/Warning';

const createTestSubject = (propsData) => {
  return shallowMount(Warning, {
      propsData: {
      ...propsData,
      },
  });
};

describe('components/Warning', () => {
  let wrapper;
  const testMessage = 'This is a test message';

  beforeEach(() => {
    wrapper = createTestSubject({ message: testMessage });
  }); 

  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders the message passed to it', () => {
    expect(wrapper.text()).toContain(testMessage);
  });
});
