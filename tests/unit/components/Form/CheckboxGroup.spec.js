import { shallowMount } from '@vue/test-utils';
import CheckboxGroup from '@/components/Form/CheckboxGroup';

const createTestSubject = (propsData) => {
  return shallowMount(CheckboxGroup, {
    propsData: {
      label: 'Example question',
      id: 'example',
      value: ['selected-checkbox-value'],
      ...propsData,
    },
    slots: {
      default: ['CheckboxItem components'],
    },
  });
};

xdescribe('components/Form/CheckboxGroup', () => {
  it('component name is "CheckboxGroup"', () => {
    expect(CheckboxGroup.name).toBe('CheckboxGroup');
  });

  xdescribe('properties', () => {
    let prop;
    /* 
    ** @todo these are now part of `FormField`, which this component extends.
    ** Therefore we could test here that this component extends FormField
    ** and move these prop tests to FormField.spec.js instead
    */
    // xdescribe('label', () => {
    //   beforeEach(() => {
    //     prop = CheckboxGroup.props.label;
    //   });

    //   it('is optional', () => {
    //     expect(prop.required).not.toBe(true);
    //     expect(prop.default).toBe('');
    //   });

    //   it('must be a String', () => {
    //     expect(prop.type).toBe(String);
    //   });
    // });

    // xdescribe('hint', () => {
    //   beforeEach(() => {
    //     prop = CheckboxGroup.props.hint;
    //   });

    //   it('is optional', () => {
    //     expect(prop.required).not.toBe(true);
    //     expect(prop.default).toBe('');
    //   });

    //   it('must be a String', () => {
    //     expect(prop.type).toBe(String);
    //   });
    // });

    // xdescribe('id', () => {
    //   beforeEach(() => {
    //     prop = CheckboxGroup.props.id;
    //   });

    //   it('is required', () => {
    //     expect(prop.required).toBe(true);
    //   });

    //   it('must be a String', () => {
    //     expect(prop.type).toBe(String);
    //   });
    // });

    xdescribe('value', () => {
      beforeEach(() => {
        prop = CheckboxGroup.props.value;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      const validTypes = [
        ['an Array', ['one', 2]],
        ['an empty Array', []],
        ['null', null],
        ['undefined', undefined],
      ];

      it.each(validTypes)('can be %s', (label, value) => {
        const valid = prop.validator(value);
        expect(valid).toBe(true);
      });

      const invalidTypes = [
        ['a String', 'hello'],
        ['an empty String', ''],
        ['a Number', 5],
        ['an Object', { one: 1, two: 2 }],
        ['a Date object', new Date()],
        ['Boolean true', true],
        ['Boolean false', false],
      ];

      it.each(invalidTypes)('cannot be %s', (label, value) => {
        const valid = prop.validator(value);
        expect(valid).toBe(false);
      });
    });
  });

  xdescribe('`v-model` interface', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject();
    });

    xdescribe('when the `value` property changes', () => {
      it('updates computed property `inputValue`', () => {
        expect(subject.vm.inputValue).toEqual(['selected-checkbox-value']);
        subject.setProps({
          value: ['some-other-value'],
        });
        expect(subject.vm.inputValue).toEqual(['some-other-value']);
      });
    });

    xdescribe('when computed property `inputValue` changes', () => {
      it('emits an `input` event', () => {
        subject.setData({
          inputValue: ['some-new-value'],
        });

        const emitted = subject.emitted().input;

        expect(emitted).toBeArrayOfSize(1);
        expect(emitted[0][0]).toEqual(['some-new-value']);
      });
    });
  });

  xdescribe('template', () => {
    let subject;

    it('the root element has the `id` attribute which was passed in as prop `id`', () => {
      subject = createTestSubject();
      expect(subject.is('#example')).toBe(true);
    });

    xdescribe('<legend> element', () => {
      xdescribe('when the `label` prop is set', () => {
        it('displays the label in a <legend> element', () => {
          subject = createTestSubject({
            label: 'Which cakes do you like?',
          });
          const legend = subject.find('legend');
          expect(legend.exists()).toBe(true);
          expect(legend.text()).toBe('Which cakes do you like?');
          expect(legend.is('.govuk-fieldset__legend')).toBe(true);
        });
      });

      xdescribe('when the `label` prop is empty', () => {
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

    xdescribe('hint text', () => {
      xdescribe('when the `hint` prop is set', () => {
        let hint;
        beforeEach(() => {
          subject = createTestSubject({
            label: 'Which cakes do you like?',
            hint: 'Choose all the cakes you like',
            id: 'liked-cakes',
          });
          hint = subject.find('span.govuk-hint');
        });

        it('displays the hint', () => {
          expect(hint.exists()).toBe(true);
          expect(hint.text()).toBe('Choose all the cakes you like');
        });

        it('gives the hint element an `id` based on the main component `id`', () => {
          expect(hint.attributes('id')).toBe('liked-cakes__hint');
        });

        it('sets attribute `aria-describedby` on the <fieldset> to reference the hint element `id`', () => {
          const fieldset = subject.find('fieldset');
          expect(fieldset.attributes('aria-describedby')).toBe('liked-cakes__hint');
        });
      });

      xdescribe('when the `hint` prop is not set', () => {
        let hint;
        beforeEach(() => {
          subject = createTestSubject({
            label: 'Which cakes do you like?',
            hint: undefined,
          });
          hint = subject.find('span.govuk-hint');
        });

        it('does not render the hint element', () => {
          expect(hint.exists()).toBe(false);
        });
      });
    });

    xdescribe('`.govuk-checkboxes` slot container', () => {
      xdescribe('if value is an array ', () => {
        let slotContainer;
        beforeEach(() => {
          subject = createTestSubject();
          slotContainer = subject.find('.govuk-checkboxes');
        });

        it('exists', () => {
          expect(slotContainer.exists()).toBe(true);
        });

        it('renders default slot content', () => {
          expect(slotContainer.text()).toBe('CheckboxItem components');
        });

        it('is inside the <fieldset>', () => {
          const fieldset = subject.find('fieldset');
          expect(fieldset.find('.govuk-checkboxes').exists()).toBe(true);
        });

      });

      xdescribe('if value is not an array ', () => {
        let slotContainer;

        beforeEach(() => {
          subject = createTestSubject({ value: null });
          slotContainer = subject.find('.govuk-checkboxes');
        });

        it('exists', () => {
          expect(slotContainer.exists()).toBe(true);
        });

        it('does not render slot content', () => {
          expect(slotContainer.text()).toBe('');
        });

      });
    });
  });

  xdescribe('lifecycle hooks', () => {
    xdescribe('created', () => {
      xdescribe('if value is an array', () => {
        it('does not call emit', ()=> {
          let array = [];
          let wrapper = createTestSubject({ value: array });
          expect(wrapper.emitted().input).not.toBeTruthy();
        });
      });
      xdescribe('if value is not an array', () => {
        it('emits the initial empty array value', ()=> {
          let wrapper = createTestSubject({ value: undefined });
          expect(wrapper.emitted().input).toBeTruthy();
        });
      });
    });
  });
});
