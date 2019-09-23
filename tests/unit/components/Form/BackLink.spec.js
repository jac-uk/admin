import { shallowMount } from '@vue/test-utils';
import BackLink from '@/components/Form/BackLink';

describe('components/Form/BackLink', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(BackLink);
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('template', () => {
    describe('id', () => {
      it('sets <a> `id` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('a').attributes().id).toBe('my_unique_key');
      });
    });
  });
});
