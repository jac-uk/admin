import AddEligibilityInformation from '@/views/AddEligibilityInformation';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Router);

describe('AddEligibilityInformation', () => {
  it('renders the view', () => {
    let wrapper = shallowMount(AddEligibilityInformation, {
      localVue,
    });

    expect(wrapper.exists()).toBe(true);
  });
  it('contains the link to Details page', () => {
    let wrapper = shallowMount(AddEligibilityInformation, {
      localVue,
    });
    expect(wrapper.find({ ref: 'linkToDetails' }).isVisible()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => {
    let wrapper = shallowMount(AddEligibilityInformation, {
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
