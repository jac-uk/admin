import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateExercise from '@/views/CreateExercise';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import saveNewExercise from '@/helpers/saveNewExercise';
import VueRouter from 'vue-router';

jest.mock('@/helpers/saveNewExercise', () => jest.fn().mockResolvedValue());

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

let store, wrapper, router;

beforeEach(() => {
  const getters = {
    exerciseData: jest.fn(() => ({ title: 'Test' })),
  };

  store = new Vuex.Store({
    modules: {
        createExercise: {
          namespaced: true,
          getters,
        },
      },
  }); 

  router = new VueRouter();

  wrapper = shallowMount(CreateExercise, {
    store,
    router,
    localVue,
  });
});

describe('CreateExercise', () => {
  it('renders the the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the child NewExerciseName component', () => {
    expect(wrapper.find(NewExerciseName).exists()).toBe(true);
  });

  it('calls saveNewExercise and redirects to dashboard page', (done) => {
    wrapper.vm.$refs.newExerciseNameComponent.$emit('submitted');
    
    setTimeout(() => {
      expect(saveNewExercise).toHaveBeenCalledWith({ title: 'Test' });
      expect(wrapper.vm.$route.path).toBe('/dashboard');
      done();
    }, 0);
  });
});
