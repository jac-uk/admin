import { shallowMount } from '@vue/test-utils';
import TextareaInput from '@/components/Form/TextareaInput';

xdescribe('components/Form/TextareaInput', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(TextareaInput);
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

      it('sets <textarea> `id` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('textarea').attributes().id).toBe('my_unique_key');
      });
    });

    xdescribe('rows', () => {
      it('sets the rows prop to the default value of 5 when no value is set', () => {
        expect(wrapper.find('textarea').attributes().rows).toBe('5');
      });

      it('sets the rows to the value of the `rows` prop', () => {
        wrapper.setProps({ rows: '2' });
        expect(wrapper.find('textarea').attributes().rows).toBe('2');
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
