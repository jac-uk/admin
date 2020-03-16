import { shallowMount } from '@vue/test-utils';
import Currency from '@/components/Form/Currency';

xdescribe('components/Form/Currency', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Currency);
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  xdescribe('template', () => {
    xdescribe('label', () => {
      it('sets the label to the value of the `label` prop', () => {
        wrapper.setProps({ label: 'My Form Label' });
        expect(wrapper.find('label').text()).toBe('My Form Label');
      });
    });
  });

    xdescribe('hint', () => {
      let hint;
      xdescribe('when the prop is set', () => {
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

      xdescribe('when the prop is not set', () => {
        beforeEach(() => {
          hint = wrapper.find('.govuk-hint');
        });

        it('does not show hint', () => {
          expect(hint.exists()).toBe(false);
        });
      });
    });

    xdescribe('id', () => {
      it('sets <label> `for` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('label').attributes().for).toBe('my_unique_key');
      });

      it('sets <input> `id` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('input').attributes().id).toBe('my_unique_key');
      });
    });

  xdescribe('`v-model` interface', () => {
    xdescribe('when `currencyInput` changes', () => {
      it('emits an input event with the new value', () => {
        wrapper.setData({ currencyInput: '25' });
        expect(wrapper.emitted().input).toEqual([['25']]);
      });
    });

    xdescribe('when value prop changes', () => {
      it('updates the `currencyInput` computed property', () => {
        wrapper.setProps({ value: 25 });
        expect(wrapper.vm.currencyInput).toEqual(25);
      });
    });
  });
});
