import { shallowMount } from '@vue/test-utils';
import ActionButton from '@/components/ActionButton';

describe('components/ActionButton', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ActionButton, {});
  });

  it('renders the component', () => {
    expect(wrapper.find('.govuk-button').exists()).toBeTrue();
  });

  describe('template', () => {
    it('default CTA text is `Submit`', () => {
      expect(wrapper.text()).toEqual('Submit');
    });

    describe('when not loading', () => {
      beforeEach(() => {
        wrapper.setData({
          isLoading: false,
        });
      });

      it('does not display spinner', () => {
        expect(wrapper.find('span.spinner-border').exists()).toBeFalse();
      });

      it('displays error message if failed', () => {
        wrapper.setData({
          hasError: true,
        });

        expect(wrapper.text()).toEqual(expect.stringContaining('Error!'));
      });

      it('displays success message if succeeded', () => {
        wrapper.setData({
          isSuccess: true,
        });

        expect(wrapper.text()).toEqual(expect.stringContaining('Success!'));
      });
    });

    describe('when loading', () => {
      beforeEach(() => {
        wrapper.setData({
          isLoading: true,
        });
      });

      it('displays spinner when loading', () => {
        expect(wrapper.find('span.spinner-border').exists()).toBeTrue();
      });

      it('does not display error message', () => {
        wrapper.setData({
          hasError: true,
        });

        expect(wrapper.text()).not.toEqual(expect.stringContaining('Error!'));
      });

      it('does not display success message', () => {
        wrapper.setData({
          isSuccess: true,
        });

        expect(wrapper.text()).not.toEqual(expect.stringContaining('Success!'));
      });
    });
  });
});
