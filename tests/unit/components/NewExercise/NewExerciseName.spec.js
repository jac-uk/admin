import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import NewExerciseName from '@/components/NewExercise/NewExerciseName';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CreateExercise view', () => {
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      setExerciseTitle: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(NewExerciseName, {
      store,
      localVue,
    });
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

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
    expect(wrapper.emitted().submitted).toBeTruthy();
  });

});
