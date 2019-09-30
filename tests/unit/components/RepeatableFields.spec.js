import { mount } from '@vue/test-utils';
import RepeatableFields from '@/components/RepeatableFields';
// import TextField to test with a component
import TextField from '@/components/Form/TextField';
// import SelectionExerciseOfficer to test slot
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer';

const createTestSubject = (props) => {
  return mount(RepeatableFields, {
    propsData: {
      value: null,
      component: TextField,
      ...props,
    },
  });
};

describe('components/RepeatableFields', () => {
  it('component name is "RepeatableFields"', () => {
    expect(RepeatableFields.name).toBe('RepeatableFields');
  });

  describe('properties', () => {
    let prop;

    describe('component', () => {
      beforeEach(() => {
        prop = RepeatableFields.props.component;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('has type Object', () => {
        expect(prop.type).toBe(Object);
      });
    });

    describe('max', () => {
      beforeEach(() => {
        prop = RepeatableFields.props.max;
      });

      it('is optional', () => {
        expect(prop.required).toBe(false);
      });

      it('has a default value false',() => {
        expect(prop.default).toBe(false);
      });

      it('must be a Number or Boolean', () => {
        expect(prop.type).toContain(Number);
        expect(prop.type).toContain(Boolean);
        expect(prop.type).not.toContain(String);
        expect(prop.type).not.toContain(Object);
        expect(prop.type).not.toContain(Array);
        expect(prop.type).not.toContain(Function);
      });
    });

    describe('value', () => {
      beforeEach(() => {
        prop = RepeatableFields.props.value;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      const validTypes = [
        ['null', null],
        ['undefined', undefined],
        ['an Array', ['one', 2]],
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

      it.each(invalidTypes)('can not be %s', (label, value) => {
        const valid = prop.validator(value);
        expect(valid).not.toBe(true);
      });
    });
  });

  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders child component', () => {
      expect(wrapper.find(TextField).exists()).toBe(true);
    });

    describe('number of repeatable components', () => {
      describe('when value is not an instance of an array', () => {
        it('renders one component', () => {
         expect(wrapper.findAll(TextField)).toHaveLength(1);
        });
      });

      describe('when value is an instance of an array', () => {
        let array = [1, 2, 3];
        let wrapper = createTestSubject({ value: array });

        it('renders number of components equal to the length of the array', () => {
          expect(wrapper.findAll(TextField)).toHaveLength(3);
        });
      });
    });

    describe('Remove button slot', () => {
      describe('when there are more then one repeatable field', () => {
        it('render a button for every repeatable field', () => {
          wrapper = createTestSubject(
            { value: [{ name: 'first' }, { name: 'second' }, { name: 'third' }],
            component: SelectionExerciseOfficer }
          );

          let buttons = wrapper.findAll('.govuk-button--warning');
          expect(buttons).toHaveLength(3);
        });
      });

      describe('when there is only one field', () => {
        it("doesn't render", () => {
          wrapper = createTestSubject(
            { value: [{ name: 'first' }],
            component: SelectionExerciseOfficer }
          );

          let buttons = wrapper.findAll('.govuk-button--warning');
          expect(buttons).toHaveLength(0);
        });
      });
    });
  });

  describe('computed properties', () => {
    describe('canAddRow', () => {
      describe('when max is not set', () => {
        let wrapper = createTestSubject();
        expect(wrapper.vm.canAddRow).toBe(true);
      });

      describe("when max is set and it's greater than number of rows", () => {
        it('sets canAddRow value to true', () => {
          let wrapper = createTestSubject({ max: 5, value: [1, 2, 3] });
          expect(wrapper.vm.canAddRow).toBe(true);
        });
      });

      describe("when max is set and it's less than number of rows", () => {
        it('sets canAddRow value to false', () => {
          let wrapper = createTestSubject({ max: 2, value: [1, 2, 3] });
          expect(wrapper.vm.canAddRow).toBe(false);
        });
      });

      describe("when max is set and it's equal to number of rows", () => {
        it('sets canAddRow value to true', () => {
          let wrapper = createTestSubject({ max: 3, value: [1, 2, 3] });
          expect(wrapper.vm.canAddRow).toBe(false);
        });
      });
    });
  });

  describe('created hook', () => {
    describe('if value is an array', () => {
      it('updates the value of rows and does not call emit', ()=> {
        let array = [1, 2, 3];
        let wrapper = createTestSubject({ value: array });
        expect(wrapper.vm.rows).toBe(array);
        expect(wrapper.emitted().input).not.toBeTruthy();
      });
    });

    describe('if value is not an array', () => {
      it('emits the initial rows value', ()=> {
        let wrapper = createTestSubject({ value: undefined });
        expect(wrapper.emitted().input).toBeTruthy();
      });
    });

    describe('if rows array is empty', () => {
      it('pushes an object to rows', ()=> {
        let wrapper = createTestSubject({ value: undefined });
        expect(wrapper.vm.rows).toContainEqual({});
      });
    });
  });

  describe('methods', () => {
    describe('addRow', () => {
      it('increases numbers of rows and renders another instance of a component', () => {
        let array = [1, 2, 3];
        let wrapper = createTestSubject({ component: TextField, value: array });
        expect(wrapper.vm.rows.length).toBe(3);

        wrapper.vm.addRow();
        expect(wrapper.vm.rows.length).toBe(4);
      });
    });

    describe('removeRow', () => {
      it('removes an item at the index', () => {
        let array = [1, 2, 3, 4];
        let wrapper = createTestSubject({ component: TextField, value: array });

        wrapper.vm.removeRow(2);
        expect(wrapper.vm.rows[0]).toBe(1);
        expect(wrapper.vm.rows[1]).toBe(2);
        expect(wrapper.vm.rows[2]).toBe(4);
      });
    });
  });
});
