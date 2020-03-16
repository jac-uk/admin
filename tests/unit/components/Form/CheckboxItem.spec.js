import { shallowMount } from '@vue/test-utils';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

const checkboxItemTemplate = ({ label, value, hint, content }) => {
  let template = `<CheckboxItem label="${label}" value="${value}" `;
  if (hint) {
    template += `hint="${hint}" `;
  }

  if (content) {
    template += `>${content}</CheckboxItem>`;
  }
  else {
    template += '/>';
  }

  return template;
};

const createTestSubject = (options) => {
  if (!options) {
    options = {
      label: 'Example checkbox item',
      value: 'example-value',
      hint: 'Something',
      content:  'Conditional content',
    };
  }

  const checkboxItem = checkboxItemTemplate(options);

  // CheckboxItem depends on the parent component being CheckboxGroup
  // So we're mocking CheckboxGroup with a CheckboxItem inside, and will return the CheckboxItem
  const checkboxes = shallowMount(CheckboxGroup, {
    propsData: {
      label: 'Example question',
      id: 'example',
      value: ['selected-checkbox-value'],
    },
    stubs: {
      CheckboxItem,
    },
    slots: {
      default: [checkboxItem],
    },
  });

  return checkboxes.find(CheckboxItem);
};

xdescribe('components/Form/CheckboxItem', () => {
  it('component name is "CheckboxItem"', () => {
    expect(CheckboxItem.name).toBe('CheckboxItem');
  });

  it('throws an error if the parent component is not "CheckboxGroup"', () => {
    /* eslint-disable no-console */
    // Mock console.error because Vue catches errors thrown by components and logs them to console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const createWithBadParent = () => {
      shallowMount(CheckboxItem, {
        propsData: {
          label: 'Example checkbox item',
          value: 'example-value',
        },
      });
    };

    expect(createWithBadParent).toThrow('CheckboxItem component can only be used inside a CheckboxGroup component');
    console.error = originalConsoleError;
    /* eslint-enable no-console */
  });

  xdescribe('properties', () => {
    let prop;

    xdescribe('label', () => {
      beforeEach(() => {
        prop = CheckboxItem.props.label;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('must be a String', () => {
        expect(prop.type).toBe(String);
      });
    });

    xdescribe('value', () => {
      beforeEach(() => {
        prop = CheckboxItem.props.value;
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

    xdescribe('hint', () => {
      beforeEach(() => {
        prop = CheckboxItem.props.hint;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
      });

      it('must be a String', () => {
        expect(prop.type).toBe(String);
      });
    });
  });

  xdescribe('data', () => {
    let subject;

    xdescribe('hasConditionalContent', () => {
      it('is true when slot content was supplied', () => {
        subject = createTestSubject({
          label: 'Example checkbox item',
          value: ['example-value'],
          content:  'Conditional content',
        });
        expect(subject.vm.hasConditionalContent).toBe(true);
      });

      it('is false when slot content was not supplied', () => {
        subject = createTestSubject({
          label: 'Example checkbox item',
          value: ['example-value'],
        });
        expect(subject.vm.hasConditionalContent).toBe(false);
      });
    });
  });

  xdescribe('template', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject();
    });

    it('renders a `.govuk-checkboxes__item` element', () => {
      const item = subject.find('.govuk-checkboxes__item');
      expect(item.exists()).toBe(true);
    });

    xdescribe('checkbox input', () => {
      let input;
      beforeEach(() => {
        input = subject.find('input[type=checkbox]');
      });

      it('renders a checkbox input', () => {
        expect(input.exists()).toBe(true);
      });

      it('has class name `.govuk-checkboxes__input`', () => {
        expect(input.is('.govuk-checkboxes__input')).toBe(true);
      });
    });

    xdescribe('label', () => {
      let label;
      beforeEach(() => {
        label = subject.find('label');
      });

      it('renders a label', () => {
        expect(label.exists()).toBe(true);
      });

      it('has class name `.govuk-checkboxes__label`', () => {
        expect(label.is('.govuk-checkboxes__label')).toBe(true);
      });

      it('contains the label text', () => {
        expect(label.text()).toBe('Example checkbox item');
      });
    });

    it('label `for` and input `id` attributes match', () => {
      subject = createTestSubject();
      const input = subject.find('input[type=checkbox]');
      const label = subject.find('label');
      expect(label.attributes('for')).toBe(input.attributes('id'));
    });

    xdescribe('hint', () => {
      let hint;
      xdescribe('when the `hint` prop is set', () => {
        beforeEach(() => {
          subject = createTestSubject({
            label: 'My label',
            value: ['my-value'],
            hint: 'Label hint text',
          });
          hint = subject.find('.govuk-checkboxes__hint');
        });

        it('renders a `.govuk-checkboxes__hint` element', () => {
          expect(hint.exists()).toBe(true);
        });

        it('contains the hint text', () => {
          expect(hint.text()).toBe('Label hint text');
        });

        it('sets attribute `aria-describedby` on the input to reference the hint element', () => {
          const input = subject.find('input[type=checkbox]');
          expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'));
        });
      });

      xdescribe('when the `hint` prop is not set', () => {
        beforeEach(() => {
          subject = createTestSubject({
            label: 'My label',
            value: ['my-value'],
          });
          hint = subject.find('.govuk-checkboxes__hint');
        });

        it('does not render', () => {
          expect(hint.exists()).toBe(false);
        });

        it('does not set attribute `aria-describedby` on the input', () => {
          const input = subject.find('input[type=checkbox]');
          expect(input.attributes()).not.toContainKey('aria-describedby');
        });
      });
    });

    xdescribe('conditional content', () => {
      xdescribe('when the checkbox is selected', () => {
        xdescribe('and conditional content was given', () => {
          it('renders conditional content', () => {
            subject = createTestSubject({
              value: ['selected-checkbox-value'],
              content: 'Conditional content here',
            });
            const conditional = subject.find('.govuk-checkboxes__conditional');
            expect(conditional.exists()).toBe(true);
          });
        });

        xdescribe('and conditional content was not given', () => {
          it('does not render conditional content', () => {
            subject = createTestSubject({
              value: ['selected-checkbox-value'],
            });
            const conditional = subject.find('.govuk-checkboxes__conditional');
            expect(conditional.exists()).toBe(false);
          });
        });
      });

      xdescribe('when the checkbox value is not selected', () => {
        it('does not render conditional content', () => {
          subject = createTestSubject({
            value: ['not-selected-value'],
            content: 'Conditional content here',
          });
          const conditional = subject.find('.govuk-checkboxes__conditional');
          expect(conditional.exists()).toBe(false);
        });
      });
    });
  });
});
