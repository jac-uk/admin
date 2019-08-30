import AddShortlistingMethods from '@/views/AddShortlistingMethods';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('AddShortlistingMethods', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(AddShortlistingMethods, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => {
    let wrapper = shallowMount(AddShortlistingMethods, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
