import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateExercise from '@/views/CreateExercise';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import saveNewExercise from '@/helpers/saveNewExercise';
import VueRouter from 'vue-router';

jest.mock('@/helpers/saveNewExercise', () => jest.fn());

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

let store, wrapper, router;

beforeEach(() => {
  store = new Vuex.Store({
    getters: {
      exerciseData: jest.fn().mockResolvedValue({ title: 'Test' }),
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
    
    expect(saveNewExercise).toHaveBeenCalled();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.path).toBe('/dashboard');
      done();
    });
  });
});
