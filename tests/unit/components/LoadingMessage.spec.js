import { shallowMount } from '@vue/test-utils';
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

  describe('slot container', () => {
    const createWrapper = (loadFailedValue) => {
      return shallowMount(LoadingMessage, {
        propsData: {
          loadFailed: loadFailedValue,
        },
        slots: {
          failedLoadMessage: "<h1 class='slot'>Test error message</h1>",
        },
      });
    };

    describe('when loadFailed is equal to true', () => {
      it('renders', () => {
        let slotContainer = createWrapper(true).find('h1.slot');
        expect(slotContainer.exists()).toBe(true);
      });
    });

    describe('when loadFailed is equal to false', () => {
      it('does not render', () => {
        let slotContainer = createWrapper(false).find('h1.slot');
        expect(slotContainer.exists()).not.toBe(true);
      });
    });
  });
});
