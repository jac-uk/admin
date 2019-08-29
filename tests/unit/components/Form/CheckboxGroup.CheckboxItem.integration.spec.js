import { shallowMount } from '@vue/test-utils';
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';

const createTestSubject = () => {
  const checkboxItems = ['one', 'two'].map(number => {
    return `<CheckboxItem label="Option ${number}" value="${number}" hint="Hint ${number}" />`;
  });

  // RadioItem depends on the parent component being RadioGroup
  // So we're mocking RadioGroup with a RadioItem inside, and will return the RadioItem
  return shallowMount(CheckboxGroup, {
    propsData: {
      label: 'Example question',
      id: 'example',
      value: ['one'],
    },
    stubs: {
      CheckboxItem,
    },
    slots: {
      default: checkboxItems,
    },
  });
};

describe('components/Form/CheckboxGroup and components/Form/CheckboxItem integration', () => {
  let subject;
  let checkboxes;
  beforeEach(() => {
    subject = createTestSubject();
    checkboxes = subject.findAll('input[type=checkbox]');
  });

  describe('binding to `inputValue`', () => {
    describe('when `inputValue` changes', () => {
      it('the selected checkbox inputs change to match', () => {
        const [optionOne, optionTwo] = checkboxes.wrappers.map(wrapper => wrapper.element);

        subject.setProps({ value: ['one'] });
        expect(optionOne.checked).toBe(true);
        expect(optionTwo.checked).toBe(false);

        subject.setProps({ value: ['two'] });
        expect(optionOne.checked).toBe(false);
        expect(optionTwo.checked).toBe(true);

        subject.setProps({ value: ['one', 'two'] });
        expect(optionOne.checked).toBe(true);
        expect(optionTwo.checked).toBe(true);

        subject.setProps({ value: [] });
        expect(optionOne.checked).toBe(false);
        expect(optionTwo.checked).toBe(false);

        subject.setProps({ value: ['any-other-value'] });
        expect(optionOne.checked).toBe(false);
        expect(optionTwo.checked).toBe(false);
      });
    });

    describe('when a checkbox input is checked', () => {
      it('it emits an `input` event with an array containing the values of the checked inputs', () => {
        subject.setProps({ value: [] });
        const [optionOne, optionTwo] = checkboxes.wrappers;

        const lastEmittedInputValue = () => {
          const emitted = subject.emitted('input');
          return emitted[emitted.length-1][0];
        };

        optionOne.setChecked(true);
        optionTwo.setChecked(false);
        expect(lastEmittedInputValue()).toEqual(['one']);

        optionOne.setChecked(false);
        optionTwo.setChecked(true);
        expect(lastEmittedInputValue()).toEqual(['two']);
      });
    });
  });

  describe('CheckboxItem element IDs', () => {
    it('checkbox input IDs are unique', () => {
      const [checkboxOne, checkboxTwo] = checkboxes.wrappers;
      expect(checkboxOne.attributes('id')).not.toEqual(checkboxTwo.attributes('id'));
    });

    it('hint element IDs are unique', () => {
      const [hintOne, hintTwo] = subject.findAll('.govuk-checkboxes__hint').wrappers;
      expect(hintOne.attributes('id')).not.toEqual(hintTwo.attributes('id'));
    });
  });
});
