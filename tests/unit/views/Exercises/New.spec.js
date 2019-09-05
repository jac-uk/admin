import New from '@/views/Exercises/New';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('views/Exercises/New', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(New, {
      localVue,
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the link to Add Exercise Contacts page', () => {
    let wrapper = shallowMount(New, {
      localVue,
    });
    expect(wrapper.find({ ref: 'linkToAddExerciseContacts' }).isVisible()).toBe(true);
  });

  describe('Accessibility:', () => {
    it('page contains h1 element', () => {
      let wrapper = shallowMount(New, {
        localVue,
      });

      expect(wrapper.contains('h1')).toBe(true);
    });
  });
});
