import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateExercise from '@/views/CreateExercise';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import saveNewExercise from '@/helpers/saveNewExercise';

jest.mock('@/helpers/saveNewExercise', () => jest.fn());

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    exerciseData: jest.fn().mockResolvedValue({ title: 'Test' }),
  },
}); 

let wrapper = shallowMount(CreateExercise, {
  store,
  localVue,
});

describe('CreateExercise', () => {
  it('renders the the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the child NewExerciseName component', () => {
    expect(wrapper.find(NewExerciseName).exists()).toBe(true);
  });

  it('calls saveNewExercise when NewExerciseName emits event', () => {
    wrapper.vm.$refs.newExerciseNameComponent.$emit('submitted');

    expect(saveNewExercise).toHaveBeenCalled();
  });
});
