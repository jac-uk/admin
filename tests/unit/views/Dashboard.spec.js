import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Dashboard from '@/views/Dashboard';
import Router from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router);

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

  it('contains the link to New Exercise page', () => {
    let wrapper = shallowMount(Dashboard, {
      store,
      localVue,
    });
    
    expect(wrapper.find({ ref: 'linkToNewExercise' }).isVisible()).toBe(true);
  });
});

describe('Accessibility:', () => {
  it('page contains h1 element', () => { 
    let wrapper = shallowMount(Dashboard, {
      store,
      localVue,
    });

    expect(wrapper.contains('h1')).toBe(true);
  });
});
 
