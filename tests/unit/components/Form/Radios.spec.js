import { shallowMount } from '@vue/test-utils';
import Radios from '@/components/Form/Radios';

const createTestSubject = (propsData) => {
  return shallowMount(Radios, {
    propsData: {
      label: 'Example question',
      id: 'example',
      value: 'selected-radio-value',
      ...propsData,
    },
    slots: {
      default: ['RadioItem components'],
    },
  });
};

describe('components/Form/Radios', () => {
  it('component name is "Radios"', () => {
    expect(Radios.name).toBe('Radios');
  });

  describe('properties', () => {
    let prop;

    describe('label', () => {
      beforeEach(() => {
        prop = Radios.props.label;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
        expect(prop.default).toBe('');
      });

      it('must be a String', () => {
        expect(prop.type).toBe(String);
      });
    });

    describe('hint', () => {
      beforeEach(() => {
        prop = Radios.props.hint;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
        expect(prop.default).toBe('');
      });

      it('must be a String', () => {
        expect(prop.type).toBe(String);
      });
    });

    describe('id', () => {
      beforeEach(() => {
        prop = Radios.props.id;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('must be a String', () => {
        expect(prop.type).toBe(String);
      });
    });

    describe('value', () => {
      beforeEach(() => {
        prop = Radios.props.value;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      const validTypes = [
        ['null', null],
        ['undefined', undefined],
        ['a String', 'hello'],
        ['an empty String', ''],
        ['a Number', 5],
        ['an Array', ['one', 2]],
        ['an Object', { one: 1, two: 2 }],
        ['a Date object', new Date()],
        ['Boolean true', true],
        ['Boolean false', false],
      ];

      it.each(validTypes)('can be %s', (label, value) => {
        const valid = prop.validator(value);
        expect(valid).toBe(true);
      });
    });
  });

  describe('`v-model` interface', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject();
    });

    describe('when the `value` property changes', () => {
      it('updates computed property `inputValue`', () => {
        expect(subject.vm.inputValue).toBe('selected-radio-value');
        subject.setProps({
          value: 'some-other-value',
        });
        expect(subject.vm.inputValue).toBe('some-other-value');
      });
    });

    describe('when computed property `inputValue` changes', () => {
      it('emits an `input` event', () => {
        subject.setData({
          inputValue: 'some-new-value',
        });

        const emitted = subject.emitted().input;

        expect(emitted).toBeArrayOfSize(1);
        expect(emitted[0][0]).toBe('some-new-value');
      });
    });
  });

  describe('template', () => {
    let subject;

    it('the root element has the `id` attribute which was passed in as prop `id`', () => {
      subject = createTestSubject();
      expect(subject.is('#example')).toBe(true);
    });



    describe('<legend> element', () => {
      describe('when the `label` prop is set', () => {
        it('displays the label in a <legend> element', () => {
          subject = createTestSubject({
            label: 'Do you want cake?',
          });
          const legend = subject.find('legend');
          expect(legend.exists()).toBe(true);
          expect(legend.text()).toBe('Do you want cake?');
          expect(legend.is('.govuk-fieldset__legend')).toBe(true);
        });
      });

      describe('when the `label` prop is empty', () => {
        it('does not render a <legend>', () => {
          subject = createTestSubject({
            label: '',
          });
          const legend = subject.find('legend');
          expect(legend.exists()).toBe(false);
        });
      });

      it('is wrapped in a <fieldset>', () => {
        subject = createTestSubject();
        const fieldset = subject.find('fieldset');
        expect(fieldset.exists()).toBe(true);
        expect(fieldset.is('.govuk-fieldset')).toBe(true);
        const legend = fieldset.find('legend');
        expect(legend.exists()).toBe(true);
      });
    });

    describe('hint text', () => {
      describe('when the `hint` prop is set', () => {
        let hint;
        beforeEach(() => {
          subject = createTestSubject({
            label: 'Do you want cake?',
            hint: "It's victoria sponge",
            id: 'wants-cake',
          });
          hint = subject.find('span.govuk-hint');
        });

        it('displays the hint', () => {
          expect(hint.exists()).toBe(true);
          expect(hint.text()).toBe("It's victoria sponge");
        });

        it('gives the hint element an `id` based on the main component `id`', () => {
          expect(hint.attributes('id')).toBe('wants-cake__hint');
        });

        it('sets attribute `aria-describedby` on the <fieldset> to reference the hint element `id`', () => {
          const fieldset = subject.find('fieldset');
          expect(fieldset.attributes('aria-describedby')).toBe('wants-cake__hint');
        });
      });

      describe('when the `hint` prop is not set', () => {
        let hint;
        beforeEach(() => {
          subject = createTestSubject({
            label: 'Do you want cake?',
            hint: undefined,
          });
          hint = subject.find('span.govuk-hint');
        });

        it('does not render the hint element', () => {
          expect(hint.exists()).toBe(false);
        });
      });
    });

    describe('`.govuk-radios` slot container', () => {
      let slotContainer;
      beforeEach(() => {
        subject = createTestSubject();
        slotContainer = subject.find('.govuk-radios');
      });

      it('exists', () => {
        expect(slotContainer.exists()).toBe(true);
      });

      it('renders default slot content', () => {
        expect(slotContainer.text()).toBe('RadioItem components');
      });

      it('is inside the <fieldset>', () => {
        const fieldset = subject.find('fieldset');
        expect(fieldset.find('.govuk-radios').exists()).toBe(true);
      });
    });
  });
});
