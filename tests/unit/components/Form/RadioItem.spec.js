// @FIXME@ *error-five* component requires parent to be 
// instance of radiogroup componenet,
// how can we effectivly mock the parent
import { createTestSubject } from '../../helpers';
import RadioItem from '@/components/Form/RadioItem';

// import RadioGroup from '@/components/Form/RadioGroup';

// const radioItemTemplate = ({ label, value, hint, content }) => {
//   let template = `<RadioItem label="${label}" value="${value}" `;
//   if (hint) {
//     template += `hint="${hint}" `;
//   }

//   if (content) {
//     template += `>${content}</RadioItem>`;
//   }
//   else {
//     template += '/>';
//   }
//   return template;
// };

// const createTestwrapper = (options) => {
//   if (!options) {
//     options = {
//       label: 'Example radio item',
//       value: 'example-value',
//       hint: 'Something',
//       content:  'Conditional content',
//     };
//   }

//   const radioItem = radioItemTemplate(options);

//   // RadioItem depends on the parent component being RadioGroup
//   // So we're mocking RadioGroup with a RadioItem inside, and will return the RadioItem
//   const radios = shallowMount(RadioGroup, {
//     propsData: {
//       label: 'Example question',
//       id: 'example',
//       value: 'selected-radio-value',
//     },
//     stubs: {
//       RadioItem,
//     },
//     slots: {
//       default: [radioItem],
//     },
//   });

//   return radios.find(RadioItem);
// };

describe('components/Form/RadioItem', () => {
  it('component name is "RadioItem"', () => {
    expect(RadioItem.name).toBe('RadioItem');
  });

  describe('props', () => {
    let prop;

    describe('label', () => {
      beforeEach(() => {
        prop = RadioItem.props.label;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('must be a String', () => {
        expect(prop.type()).toBeString();
      });
    });

    describe('value', () => {
      beforeEach(() => {
        prop = RadioItem.props.value;
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

    describe('hint', () => {
      beforeEach(() => {
        prop = RadioItem.props.hint;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
      });

      it('must be a String', () => {
        expect(prop.type()).toBeString();
      });
    });
  });

  describe('component instance', () => {

    it('throws an error if the parent component is not "RadioGroup"', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const BadParent = () => {
        return createTestSubject(RadioItem, {
          stubs: [],
          propsData: {
            label: 'Example radio item',
            value: 'example-value',
          },
        });
      };
  
      expect(BadParent).toThrow('RadioItem component can only be used inside a RadioGroup component');
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
    xdescribe('data', () => {
      let wrapper;
      
      describe('hasConditionalContent', () => {
        it('is true when slot content was supplied', () => {
          wrapper = createTestSubject(RadioItem, {
            propsData: {
              label: 'Example radio item',
              value: 'example-value',
              content:  'Conditional content',
            },
            stubs: [],
          });
          expect(wrapper.vm.hasConditionalContent).toBe(true);
        });
        
        it('is false when slot content was not supplied', () => {
          wrapper = createTestSubject({
            label: 'Example radio item',
            value: 'example-value',
          });
          expect(wrapper.vm.hasConditionalContent).toBe(false);
        });
      });
    });
    
  xdescribe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject(RadioItem, {

      });
    });
    
    it('renders a `.govuk-radios__item` element', () => {
      const item = wrapper.find('.govuk-radios__item');
      expect(item.exists()).toBe(true);
    });
    
    describe('radio input', () => {
      let input;
      beforeEach(() => {
        input = wrapper.find('input[type=radio]');
      });

      it('renders a radio input', () => {
        expect(input.exists()).toBe(true);
      });
      
      it('has class name `.govuk-radios__input`', () => {
        expect(input.is('.govuk-radios__input')).toBe(true);
      });
    });

    describe('label', () => {
      let label;
      beforeEach(() => {
        label = wrapper.find('label');
      });
      
      it('renders a label', () => {
        expect(label.exists()).toBe(true);
      });
      
      it('has class name `.govuk-radios__label`', () => {
        expect(label.is('.govuk-radios__label')).toBe(true);
      });
      
      it('contains the label text', () => {
        expect(label.text()).toBe('Example radio item');
      });
    });

    it('label `for` and input `id` attributes match', () => {
      wrapper = createTestSubject();
      const input = wrapper.find('input[type=radio]');
      const label = wrapper.find('label');
      expect(label.attributes('for')).toBe(input.attributes('id'));
    });
    
    describe('hint', () => {
      let hint;
      describe('when the `hint` prop is set', () => {
        beforeEach(() => {
          wrapper = createTestSubject({
            label: 'My label',
            value: 'my-value',
            hint: 'Label hint text',
          });
          hint = wrapper.find('.govuk-radios__hint');
        });
        
        it('renders a `.govuk-radios__hint` element', () => {
          expect(hint.exists()).toBe(true);
        });

        it('contains the hint text', () => {
          expect(hint.text()).toBe('Label hint text');
        });
        
        it('sets attribute `aria-describedby` on the input to reference the hint element', () => {
          const input = wrapper.find('input[type=radio]');
          expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'));
        });
      });
      
      describe('when the `hint` prop is not set', () => {
        beforeEach(() => {
          wrapper = createTestSubject({
            label: 'My label',
            value: 'my-value',
          });
          hint = wrapper.find('.govuk-radios__hint');
        });
        
        it('does not render', () => {
          expect(hint.exists()).toBe(false);
        });
        
        it('does not set attribute `aria-describedby` on the input', () => {
          const input = wrapper.find('input[type=radio]');
          expect(input.attributes()).not.toContainKey('aria-describedby');
        });
      });
    });
    
    describe('conditional content', () => {
      describe('when the radio value is selected', () => {
        describe('and conditional content was given', () => {
          it('renders conditional content', () => {
            wrapper = createTestSubject({
              value: 'selected-radio-value',
              content: 'Conditional content here',
            });
            const conditional = wrapper.find('.govuk-radios__conditional');
            expect(conditional.exists()).toBe(true);
          });
        });
        
        describe('and conditional content was not given', () => {
          it('does not render conditional content', () => {
            wrapper = createTestSubject({
              value: 'selected-radio-value',
            });
            const conditional = wrapper.find('.govuk-radios__conditional');
            expect(conditional.exists()).toBe(false);
          });
        });
      });
      
      describe('when the radio value is not selected', () => {
        it('does not render conditional content', () => {
          wrapper = createTestSubject({
            value: 'not-selected-value',
            content: 'Conditional content here',
          });
          const conditional = wrapper.find('.govuk-radios__conditional');
          expect(conditional.exists()).toBe(false);
        });
      });
    });
  });
});
});
