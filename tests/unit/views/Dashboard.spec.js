import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Dashboard from '@/views/Dashboard';

const localVue = createLocalVue();
localVue.use(Vuex);

const vacancies = {
  namespaced: true,
  state: {
    vacancies: [],
  },
};

const store = new Vuex.Store({
  modules: {
    vacancies,
  },
});  


describe('Dashboard view', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(Dashboard, {
      store,
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});

describe("Accessibility:", () => {
  it('page contains h1 and h2 elements', () => { 
    let wrapper = shallowMount(Dashboard, {
      store,
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
    expect(wrapper.contains('h2')).toBe(true);
  });
})
 
