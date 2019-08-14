import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreateExercise from '@/views/CreateExercise';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';
import NewExerciseType from '@/components/NewExercise/NewExerciseType';
import saveNewExercise from '@/helpers/saveNewExercise';
import VueRouter from 'vue-router';

jest.mock('@/helpers/saveNewExercise', () => jest.fn().mockResolvedValue());

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('CreateExercise', () => {
  let store, wrapper, router, getters, actions;

  beforeEach(() => {
    getters = {
      exerciseData: jest.fn(() => ({ title: 'Test', type: 'legal' })),
      exerciseTitle: jest.fn(() => ' Salaried Judge of the Upper Tribunal, Immigration and Asylum Chamber'),
    };

    actions = {
      resetNewExercise: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        createExercise: {
          namespaced: true,
          getters,
          actions,
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

  it('renders the the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('calls saveNewExercise and redirects to dashboard page', (done) => {
    wrapper.vm.$refs.newExerciseTypeComponent.$emit('submitted');
    
    setTimeout(() => {
      expect(saveNewExercise).toHaveBeenCalledWith({ title: 'Test', type: 'legal' });
      expect(wrapper.vm.$route.path).toBe('/dashboard');
      expect(actions.resetNewExercise.mock.calls.length).toBe(1);
      done();
    }, 0);
  });

  describe("when title doesn't exist", () => {
    let store, wrapper, router, getters;
    beforeEach(() => {
      getters = {
        exerciseData: jest.fn(() => ({ title: 'Test', type: 'legal' })),
        exerciseTitle: jest.fn(() => (null)),
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

    it('renders the child NewExerciseName component if the title does not exist', () => {
      expect(wrapper.find(NewExerciseName).exists()).toBe(true);
    });
  });

  describe("when title doesn't exist", () => {
    let store, wrapper, router;
    beforeEach(() => {
      const getters = {
        exerciseData: jest.fn(() => ({ title: 'Test', type: 'legal' })),
        exerciseTitle: jest.fn(() => ' Salaried Judge of the Upper Tribunal, Immigration and Asylum Chamber'),
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

    it('renders the child NewExerciseType component if the title exists', () => {
      expect(wrapper.find(NewExerciseType).exists()).toBe(true);
    });
  });
});
