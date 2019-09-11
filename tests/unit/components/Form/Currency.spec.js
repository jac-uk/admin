import { shallowMount } from '@vue/test-utils';
import Currency from '@/components/Form/Currency';

describe('components/Form/Currency', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Currency);
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('template', () => {
    describe('label', () => {
      it('sets the label to the value of the `label` prop', () => {
        wrapper.setProps({ label: 'My Form Label' });
        expect(wrapper.find('label').text()).toBe('My Form Label');
      });
    });
  });


    describe('hint', () => {
      let hint;
      describe('when the prop is set', () => {
        beforeEach(() => {
          wrapper.setProps({ hint: 'my_hint' });
          hint = wrapper.find('.govuk-hint');
        });

        it('shows a hint', () => {
          expect(hint.exists()).toBe(true);
        });
        it('sets the hint to the value of the `hint` prop', () => {
          expect(hint.text()).toBe('my_hint');
        });
      });

      describe('when the prop is not set', () => {
        beforeEach(() => {
          hint = wrapper.find('.govuk-hint');
        });

        it('does not show hint', () => {
          expect(hint.exists()).toBe(false);
        });
      });
    });

    describe('id', () => {
      it('sets <label> `for` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('label').attributes().for).toBe('my_unique_key');
      });

      it('sets <input> `id` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('input').attributes().id).toBe('my_unique_key');
      });
    });

  describe('`v-model` interface', () => {
    describe('when `currencyInput` changes', () => {
      it('emits an input event with the new value', () => {
        wrapper.setData({ currencyInput: 25 });
        expect(wrapper.emitted().input).toEqual([[25]]);
      });
    });

    describe('when value prop changes', () => {
      it('updates the `currencyInput` computed property', () => {
        wrapper.setProps({ value: 25 });
        expect(wrapper.vm.currencyInput).toEqual(25);
      });
    });
  });
});
