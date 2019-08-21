import AboutTheRole from '@/views/AboutTheRole';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('AboutTheRole', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(AboutTheRole, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => {
    let wrapper = shallowMount(AboutTheRole, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
