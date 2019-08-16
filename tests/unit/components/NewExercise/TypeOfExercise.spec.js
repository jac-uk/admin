import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import TypeOfExercise from '@/components/NewExercise/TypeOfExercise';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('components/NewExercise/TypeOfExercise', () => {
  let actions;
  let store;
  let wrapper;
  let router;

  beforeEach(() => {
    actions = {
      setExerciseType: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        createExercise: {
          namespaced: true,
          actions,
        },
      },
    });

    router = new VueRouter();

    wrapper = shallowMount(TypeOfExercise, {
      store,
      localVue,
      router,
    });
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('onSave method', () => {
    it('calls saveType on button click', () => { 
      const saveType = jest.fn();
      wrapper.setMethods({ saveType });
      wrapper.find({ ref: 'submitSaveType' }).trigger('click');

      expect(saveType).toHaveBeenCalled();
    });

    it('dispatches action to store', () => {
      wrapper.setData({ type: 'legal' });
      wrapper.vm.saveType();

      expect(actions.setExerciseType.mock.calls.length).toBe(1);
      expect(actions.setExerciseType.mock.calls[0][1]).toBe('legal');
    });
  });
});
