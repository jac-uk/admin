import ViewExercise from '@/views/ViewExercise';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('ViewExercise', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(ViewExercise, {
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => { 
    let wrapper = shallowMount(ViewExercise, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});

