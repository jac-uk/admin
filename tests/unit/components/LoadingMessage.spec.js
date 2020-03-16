import { shallowMount } from '@vue/test-utils';
import LoadingMessage from '@/components/LoadingMessage';

xdescribe('components/LoadingMessage', () => {
  const createWrapper = (loadFailedValue) => {
    return shallowMount(LoadingMessage, {
      propsData: {
        loadFailed: loadFailedValue,
      },
    });
  };

  xdescribe('when `loadFailed` is equal to `false`', () => {
    it('shows the "Loading" message', () => {
      const wrapper = createWrapper(false);

      expect(wrapper.find({ ref: 'loadingMessage' }).isVisible()).toBe(true);
      expect(wrapper.find({ ref: 'errorMessage' }).exists()).toBe(false);
    });
  });

  xdescribe('when `loadFailed` is equal to `true`', () => {
    it('shows the errorMessage', () => {
      const wrapper = createWrapper(true);

      expect(wrapper.find({ ref: 'errorMessage' }).isVisible()).toBe(true);
      expect(wrapper.find({ ref: 'loadingMessage' }).exists()).toBe(false);
    });
  });
});
