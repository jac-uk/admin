import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import NewExerciseType from '@/components/NewExercise/NewExerciseType';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('components/NewExercise/NewExerciseType', () => {
  let actions;
  let store;
  let wrapper;

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

    wrapper = shallowMount(NewExerciseType, {
      store,
      localVue,
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

    it('emits submitted event', () => {
      wrapper.setData({ name: 'legal' });
      wrapper.vm.saveType();
      
      expect(wrapper.emitted().submitted).toBeTruthy();
    });

  });
});
