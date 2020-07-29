import { shallowMount } from '@vue/test-utils';
import SelectionDay from '@/components/RepeatableFields/SelectionDay';
import DateInput from '@/components/Form/DateInput';

const createTestSubject = (props) => {
  return shallowMount(SelectionDay, {
    propsData: {
      ...props,
    },
  });
};

describe('@/components/RepeatableFields/SelectionDay', () => {
  describe('name', () => {
    it('component name is "SelectionDay"', () => {
      expect(SelectionDay.name).toBe('SelectionDay');
    });
  });

  describe('props', () => {
    describe('row', () => {
      it('is required', () => {
        const prop = SelectionDay.props.row;
        expect(prop.required).toBe(true);
      });

      it('has type object', () => {
        const prop = SelectionDay.props.row;
        expect(prop.type).toBe(Object);
      });
    });

    describe('index', () => {
      it('is required', () => {
        const prop = SelectionDay.props.index;
        expect(prop.required).toBe(true);
      });

      it('has type number', () => {
        const prop = SelectionDay.props.index;
        expect(prop.type).toBe(Number);
      });
    });
  });

  describe('computed properties', () => {
    describe('selectionDayIdStart', () => {
      it('returns the value that is created using index', () => {
        const wrapper = createTestSubject({ index: 4, row: {} });
        expect(wrapper.vm.selectionDayIdStart).toBe('selection_start_4');
      });
    });

    describe('selectionDayIdEnd', () => {
      it('returns the value that is created using index', () => {
        const wrapper = createTestSubject({ index: 5, row: {} });
        expect(wrapper.vm.selectionDayIdStart).toBe('selection_start_5');
      });
    });
  });

  describe('template', () => {
    it('renders DateInput', () => {
      const wrapper = createTestSubject({ index: 1, row: {} });
      expect(wrapper.find(DateInput).exists()).toBe(true);
    });
  });
});
