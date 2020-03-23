import TextField from '@/components/Form/TextField';
import { shallowMount } from '@vue/test-utils';

// repeatable components
import DraftingJudge from '@/components/RepeatableFields/DraftingJudge';
import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee';
import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer';
import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner';
import OtherShortlistingMethod from '@/components/RepeatableFields/OtherShortlistingMethod';

// add repeatable text component to this array
const repeatableTextFields = [
  ['DraftingJudge', DraftingJudge],
  ['StatutoryConsultee', StatutoryConsultee],
  ['SelectionExerciseOfficer', SelectionExerciseOfficer],
  ['AssignedCommissioner', AssignedCommissioner],
  ['OtherShortlistingMethod', OtherShortlistingMethod],
];

xdescribe('Repeatable text fields', () => {
  xdescribe.each(repeatableTextFields)('@/components/RepeatableFields/%s', (label, component) => {
    it('renders TextField component', () => {
      const wrapper = shallowMount(component, {
        propsData: {
          row: {},
          index: 1,
        },
      });
      expect(wrapper.find(TextField).exists()).toBe(true);
    });

    xdescribe('props', () => {
      xdescribe('row', () => {
        let prop;

        beforeEach(() => {
          prop = component.props.row;
        });

        it('is required', () => {
          expect(prop.required).toBe(true);
        });

        it('has a type object', () => {
          expect(prop.type).toBe(Object);
        });
      });

      xdescribe('index', () => {
        let prop;

        beforeEach(() => {
          prop = component.props.index;
        });

        it('is required', () => {
          expect(prop.required).toBe(true);
        });

        it('has a type number', () => {
          expect(prop.type).toBe(Number);
        });
      });
    });
  });
});
