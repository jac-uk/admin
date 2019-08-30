import AddExerciseContacts from '@/views/AddExerciseContacts';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('AddExerciseContacts', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(AddExerciseContacts, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => {
    let wrapper = shallowMount(AddExerciseContacts, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
