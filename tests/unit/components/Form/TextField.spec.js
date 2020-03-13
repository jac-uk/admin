import { shallowMount } from '@vue/test-utils';
import TextField from '@/components/Form/TextField';

xdescribe('components/Form/TextField', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(TextField);
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

    xdescribe('inputClass', () => {
      let input;
      beforeEach(() => {
        input = wrapper.find('input');
      });

      xdescribe('when the prop is set', () => {
        beforeEach(() => {
          wrapper.setProps({ inputClass: 'my_styling' });
        });

        it('includes the added value in the <input> `class` attribute', () => {
          expect(input.is('.my_styling')).toBe(true);
        });

        it('has the <input> `class` govuk-input', () => {
          expect(input.is('.govuk-input')).toBe(true);
        });
      });

      xdescribe('when the prop is not set', () => {
        it('has the <input> `class` govuk-input', () => {
          expect(input.is('.govuk-input')).toBe(true);
        });
      });
    });

    xdescribe('type', () => {
      xdescribe('when the prop is set', () => {
        it('includes the added value in the <input> `type` attribute', () => {
          wrapper.setProps({ type: 'my_type' });
          expect(wrapper.find('input').attributes('type')).toBe('my_type');
        });
      });

      xdescribe('when the prop is not set', () => {
        it('has the default <input> `type` text', () => {
          expect(wrapper.find('input').attributes('type')).toBe('text');
        });
      });
    });
  });

  xdescribe('`v-model` interface', () => {
    xdescribe('when text changes', () => {
      it('emits an input event with the new value', () => {
        wrapper.setData({ text: 'new-value' });
        expect(wrapper.emitted().input).toEqual([['new-value']]);
      });
    });

    xdescribe('when value prop changes', () => {
      it('updates the `text` computed property', () => {
        wrapper.setProps({ value: 'my_value' });
        expect(wrapper.vm.text).toEqual('my_value');
      });
    });
  });
});
