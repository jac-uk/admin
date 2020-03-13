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

xdescribe('@/components/RepeatableFields/SelectionDay', () => {
  xdescribe('name', () => {
    it('component name is "SelectionDay"', () => {
      expect(SelectionDay.name).toBe('SelectionDay');
    });
  });

  xdescribe('props', () => {
    xdescribe('row', () => {
      it('is required', () => {
        let prop = SelectionDay.props.row;
        expect(prop.required).toBe(true);
      });

      it('has type object', () => {
        let prop = SelectionDay.props.row;
        expect(prop.type).toBe(Object);
      });
    });

    xdescribe('index', () => {
      it('is required', () => {
        let prop = SelectionDay.props.index;
        expect(prop.required).toBe(true);
      });

      it('has type number', () => {
        let prop = SelectionDay.props.index;
        expect(prop.type).toBe(Number);
      });
    });
  });

  xdescribe('computed properties', () => {
    xdescribe('selectionDayIdStart', () => {
      it('returns the value that is created using index', () => {
        let wrapper = createTestSubject({ index: 4, row: {} });
        expect(wrapper.vm.selectionDayIdStart).toBe('selection_start_4');
      });
    });

    xdescribe('selectionDayIdEnd', () => {
      it('returns the value that is created using index', () => {
        let wrapper = createTestSubject({ index: 5, row: {} });
        expect(wrapper.vm.selectionDayIdStart).toBe('selection_start_5');
      });
    });
  });

  xdescribe('template', () => {
    it('renders DateInput', () => {
      let wrapper = createTestSubject({ index: 1, row: {} });
      expect(wrapper.find(DateInput).exists()).toBe(true);
    });
  });
});
