import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateExercise from '@/views/CreateExercise';
import ExerciseName from '@/components/NewExercise/ExerciseName';

const localVue = createLocalVue();
localVue.use(Vuex);


const store = new Vuex.Store({
  // modules: {
  //   vacancies,
  // },
});  

describe('CreateExercise view', () => {
  it('renders the component', () => {
    let wrapper = shallowMount(CreateExercise, {
      store,
      localVue,
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the ExerciseName component', () => {
    let wrapper = shallowMount(CreateExercise, {
      store,
      localVue,
    });
    
    expect(wrapper.find(ExerciseName).exists()).toBe(true);
  });
});
