import { shallowMount } from '@vue/test-utils';
import AddToFavouritesButton from '@/components/Page/AddToFavouritesButton';

describe('@/components/Page/AddToFavouritesButton', () => {
  it("renders", () => {
    let wrapper = shallowMount(AddToFavouritesButton);
    expect(wrapper.exists()).toBe(true);
  })
})
