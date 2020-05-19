import { createTestSubject } from '../../helpers';
import TextField from '@/components/Form/TextField';

describe('components/Form/TextField', () => {
  describe('props', () => {
    let prop;

    describe('inputClass', () => {
      beforeEach(() => {
        prop = TextField.props.inputClass;
      });

      it('type is String', () => {
        expect(prop.type()).toBeString();
      });

      it('defaults as \'\'', () => {
        expect(prop.default).toBe('');
      });

    });
    
    describe('value', () => {
      beforeEach(() => {
        prop = TextField.props.value;
      });

      it('type is String', () => {
        expect(prop.type()).toBeString();
      });

      it('defaults as \'\'', () => {
        expect(prop.default).toBe('');
      });

    });

    describe('type', () => {
      beforeEach(() => {
        prop = TextField.props.type;
      });

      it('type is String', () => {
        expect(prop.type()).toBeString();
      });

      it('defaults as \'text\'', () => {
        expect(prop.default).toBe('text');
      });

    });

  });
  describe('component instance', () => {

  let wrapper;
  const mockProps = {
    id: 'mockId',
  };

  beforeEach(() => {
    wrapper = createTestSubject(TextField, {
      stubs: [],
      propsData: mockProps,
    });
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

    describe('inputClass', () => {
      let input;
      beforeEach(() => {
        input = wrapper.find('input');
      });

      describe('when the prop is set', () => {
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

      describe('when the prop is not set', () => {
        it('has the <input> `class` govuk-input', () => {
          expect(input.is('.govuk-input')).toBe(true);
        });
      });
    });

    describe('type', () => {
      describe('when the prop is set', () => {
        it('includes the added value in the <input> `type` attribute', () => {
          wrapper.setProps({ type: 'my_type' });
          expect(wrapper.find('input').attributes('type')).toBe('my_type');
        });
      });

      describe('when the prop is not set', () => {
        it('has the default <input> `type` text', () => {
          expect(wrapper.find('input').attributes('type')).toBe('text');
        });
      });
    });

    xdescribe('autocomplete', () => {
      it('sets autocomplete for email', () => {
        const type = 'email';
        wrapper.setProps({ type });

        expect(wrapper.find('input').attributes('autocomplete')).toBe(type);
      });

      xit('sets autocomplete for phone number', () => {
        const type = 'tel';
        wrapper.setProps({ type });

        expect(wrapper.find('input').attributes('autocomplete')).toBe(type);
      });

      it('doesn\'t set autocomplete for other types', () => {
        wrapper.setProps({ type: 'text' });

        expect(wrapper.find('input').attributes('autocomplete')).toBeFalsy();
      });
    });
  });

  describe('`v-model` interface', () => {
    describe('when text changes', () => {
      it('emits an input event with the new value', () => {
        wrapper.setData({ text: 'new-value' });
        expect(wrapper.emitted().input).toEqual([['new-value']]);
      });
    });

    describe('when value prop changes', () => {
      it('updates the `text` computed property', () => {
        wrapper.setProps({ value: 'my_value' });
        expect(wrapper.vm.text).toEqual('my_value');
      });
    });
  });
});
});
