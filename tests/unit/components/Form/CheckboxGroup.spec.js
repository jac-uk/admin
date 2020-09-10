import { createTestSubject } from '../../helpers';
import CheckboxGroup from '@/components/Form/CheckboxGroup';

describe('components/Form/CheckboxGroup', () => {

  it('component name is "CheckboxGroup"', () => {
    expect(CheckboxGroup.name).toBe('CheckboxGroup');
  });

  describe('props', () => {
    let prop;
    describe('value', () => {
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

  describe('component functions', () => {
    let wrapper;
    const inputMock = jest.fn();
    beforeEach(() => {
      wrapper = createTestSubject(CheckboxGroup, {
        mocks: {
          emitted: {
            input: inputMock,
          },
        },
        stubs: [],
        propsData: {
          value: ['selected-checkbox-value'],
          id: '',
        },
      });
    });  
    
    describe('`v-model` interface', () => {
      it('renders successfully', () => {
        expect(wrapper.exists()).toBeTrue();
      });

    describe('when the `value` property changes', () => {
      it('updates computed property `inputValue`', () => {
        wrapper.setProps({
          value: ['some-other-value'],
        });
        expect(wrapper.vm.inputValue).toEqual(['some-other-value']);
      });
    });

    describe('when computed property `inputValue` changes', () => {
      it('emits an `input` event', () => {
        wrapper.setData({
          inputValue: ['some-new-value'],
        });

        const emitted = wrapper.emitted().input;

        expect(emitted).toBeArrayOfSize(1);
        expect(emitted[0][0]).toEqual(['some-new-value']);
      });
    });
  });

  describe('lifecycle hooks', () => {
    describe('created', () => {
      describe('if value is an array', () => {
        xit('does not call emit', ()=> {
          expect(inputMock).toHaveBeenCalledWith('??');
        });
      });
      describe('if value is not an array', () => {
        xit('emits the initial empty array value', ()=> {
          wrapper.setProps({ value: undefined });
          expect(inputMock).toHaveBeenCalledWith('??');
          // expect(wrapper.emitted()).toBe('??');
        });
      });
    });
  });

  });

});
