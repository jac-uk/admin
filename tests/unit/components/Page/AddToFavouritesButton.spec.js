import { shallowMount } from '@vue/test-utils';
import AddToFavouritesButton from '@/components/Page/AddToFavouritesButton';

xdescribe('@/components/Page/AddToFavouritesButton', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AddToFavouritesButton);
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('methods', () => {
    describe('updateFavoutites', () => {
      it('updates a value of isInFavourites', () => {
        const isInFavourites = wrapper.vm.isInFavourites;
        wrapper.find('button').trigger('click');
        
        expect(wrapper.vm.isInFavourites).toBe(!isInFavourites);
      });
    });
  });
});
