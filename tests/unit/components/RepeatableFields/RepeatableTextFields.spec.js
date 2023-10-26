// import { shallowMount } from '@vue/test-utils';

// // repeatable components
// import DraftingJudge from '@/components/RepeatableFields/DraftingJudge.vue';
// import StatutoryConsultee from '@/components/RepeatableFields/StatutoryConsultee.vue';
// import SelectionExerciseOfficer from '@/components/RepeatableFields/SelectionExerciseOfficer.vue';
// import AssignedCommissioner from '@/components/RepeatableFields/AssignedCommissioner.vue';
// import OtherShortlistingMethod from '@/components/RepeatableFields/OtherShortlistingMethod.vue';

// // add repeatable text component to this array
// const repeatableTextFields = [
//   ['DraftingJudge', DraftingJudge],
//   ['StatutoryConsultee', StatutoryConsultee],
//   ['SelectionExerciseOfficer', SelectionExerciseOfficer],
//   ['AssignedCommissioner', AssignedCommissioner],
//   ['OtherShortlistingMethod', OtherShortlistingMethod],
// ];

// describe('Repeatable text fields', () => {
//   describe.each(repeatableTextFields)('@/components/RepeatableFields/%s', (label, component) => {
//     it('renders TextField component', () => {
//       const wrapper = shallowMount(component, {
//         propsData: {
//           row: {},
//           index: 1,
//         },
//       });
//       expect(wrapper.find('textfield-stub').exists()).toBe(true);
//     });

//     describe('props', () => {
//       describe('row', () => {
//         let prop;

//         beforeEach(() => {
//           prop = component.props.row;
//         });

//         it('is required', () => {
//           expect(prop.required).toBe(true);
//         });

//         it('has a type object', () => {
//           expect(prop.type).toBe(Object);
//         });
//       });

//       describe('index', () => {
//         let prop;

//         beforeEach(() => {
//           prop = component.props.index;
//         });

//         it('is required', () => {
//           expect(prop.required).toBe(true);
//         });

//         it('has a type number', () => {
//           expect(prop.type).toBe(Number);
//         });
//       });
//     });
//   });
// });

it('empty suite', () => {

});
