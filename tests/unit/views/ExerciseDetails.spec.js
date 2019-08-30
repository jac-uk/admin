import ExerciseDetails from '@/views/ExerciseDetails';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('ExerciseDetails', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(ExerciseDetails, {
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => { 
    let wrapper = shallowMount(ExerciseDetails, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});

