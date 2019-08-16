import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import NameOfExercise from '@/components/NewExercise/NameOfExercise';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('components/NewExercise/NameOfExercise', () => {
  let actions;
  let store;
  let wrapper;
  let router;

  beforeEach(() => {
    actions = {
      setExerciseTitle: jest.fn(),
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

    wrapper = shallowMount(NameOfExercise, {
      store,
      localVue,
      router,
    });
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('onSave method', () => {
    it('calls saveName on button click', () => { 
      const saveName = jest.fn();
      wrapper.setMethods({ saveName });
      wrapper.find({ ref: 'submitSaveName' }).trigger('click');

      expect(saveName).toHaveBeenCalled();
    });

    it('dispatches action to store', () => {
      wrapper.setData({ name: 'testName' });
      wrapper.vm.saveName();

      expect(actions.setExerciseTitle.mock.calls.length).toBe(1);
      expect(actions.setExerciseTitle.mock.calls[0][1]).toBe('testName');
    });
  });
});
