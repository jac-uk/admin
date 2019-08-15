import { shallowMount } from '@vue/test-utils';
import InformationAboutRole from '@/components/NewExercise/InformationAboutRole';
import TextField from '@/components/Form/TextField';

describe('components/NewExercise/InformationAboutRole', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InformationAboutRole);
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('child components', () => {
    it('renders TextField component', () => {
      expect(wrapper.find(TextField).exists()).toBe(true);
    });
  });
});
