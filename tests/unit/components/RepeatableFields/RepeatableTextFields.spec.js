import TextField from '@/components/Form/TextField';
import { shallowMount } from '@vue/test-utils';

// repeatable components
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';

// add repeatable text component to this array
const repeatableTextFields = [
  ['DraftingJudge', DraftingJudge],
  ['StatutoryConsultee', StatutoryConsultee],
];

describe('RepeatableTextFields', () => {
  it.each(repeatableTextFields)('renders TextField component for %s', (label, component) => {
    const wrapper = shallowMount(component, {
      propsData: {
        row: {},
        index: 1,
      },
    });
    expect(wrapper.find(TextField).exists()).toBe(true);
  });

  describe('props', () => {
    it.each(repeatableTextFields)('%s: row is required and has a type object', (label, component) => {
      let prop = component.props.row;
    
      expect(prop.required).toBe(true);
      expect(prop.type).toBe(Object);
    });

    it.each(repeatableTextFields)('%s: index is required and has a type number', (label, component) => {
      let prop = component.props.index;
    
      expect(prop.required).toBe(true);
      expect(prop.type).toBe(Number);
    });
  });
});
