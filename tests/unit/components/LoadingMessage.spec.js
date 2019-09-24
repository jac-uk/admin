import { shallowMount } from '@vue/test-utils';
import LoadingMessage from '@/components/LoadingMessage';

describe('components/LoadingMessage', () => {
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

  describe('when loadFailed is equal to false', () => {
    it('shows the "Loading" message', () => {
      const wrapper = createWrapper(false);

      expect(wrapper.find({ ref: 'loadingMessage' }).isVisible()).toBe(true);
      expect(wrapper.find({ ref: 'errorMessage' }).exists()).toBe(false);
    });

    it('does not render the slot', () => {
      let slotContainer = createWrapper(false).find('h1.slot');
      expect(slotContainer.exists()).not.toBe(true);
    });
  });

  describe('when loadFailed is equal to true', () => {
    it('shows the errorMessage', () => {
      const wrapper = createWrapper(true);

      expect(wrapper.find({ ref: 'errorMessage' }).isVisible()).toBe(true);
      expect(wrapper.find({ ref: 'loadingMessage' }).exists()).toBe(false);
    });

    it('renders the slot', () => {
        let slotContainer = createWrapper(true).find('h1.slot');
        expect(slotContainer.exists()).toBe(true);
      });
  });
});
