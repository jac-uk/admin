import { createTestSubject } from '../helpers';
import Warning from '@/components/Warning';

describe('components/Warning', () => {
  let wrapper;
  const testMessage = 'This is a test message';

  beforeEach(() => {
    wrapper = createTestSubject(Warning, { 
      propsData: {
        message: testMessage,
      },
      stubs: [],
      mocks: [],
    });
  }); 

  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders the message passed to it', () => {
    expect(wrapper.text()).toContain(testMessage);
  });
});
