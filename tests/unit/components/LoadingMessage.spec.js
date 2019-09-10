import {shallowMount} from '@vue/test-utils';
import LoadingMessage from '@/components/LoadingMessage';

describe('components/LoadingMessage', () => {
  it('shows the "Loading" message if loadFailed is equal to false', () => {
    const wrapper = shallowMount(LoadingMessage, {
      propsData: {
        loadFailed: false,
      },
    });

    expect(wrapper.find({ ref: 'loadingMessage' }).isVisible()).toBe(true);
    expect(wrapper.find({ ref: 'errorMessage' }).exists()).toBe(false);
  });

  it('shows the errorMessage message if loadFailed is equal to true', () => {
    const wrapper = shallowMount(LoadingMessage, {
      propsData: {
        loadFailed: true,
      },
    });

    expect(wrapper.find({ ref: 'errorMessage' }).isVisible()).toBe(true);
    expect(wrapper.find({ ref: 'loadingMessage' }).exists()).toBe(false);
  });
});
