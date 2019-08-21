import CreateAnExercise from '@/views/CreateAnExercise';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('CreateAnExercise', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(CreateAnExercise, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => {
    let wrapper = shallowMount(CreateAnExercise, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
