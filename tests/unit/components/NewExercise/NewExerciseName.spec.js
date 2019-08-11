import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';

const localVue = createLocalVue();
localVue.use(Vuex);

// const vacancies = {
//   namespaced: true,
//   state: {
//     vacancies: [],
//   },
// };

const store = new Vuex.Store({
  // modules: {
  //   vacancies,
  // },
});  

describe('CreateExercise view', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(NewExerciseName, {
      store,
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });
});
