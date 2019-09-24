import { shallowMount } from '@vue/test-utils';
import BackLink from '@/components/BackLink';

describe('components/BackLink', () => {
  let wrapper;
  const mockRouter = {
    back: jest.fn(),
  };
  beforeEach(() => {
    wrapper= shallowMount(BackLink, {
    mocks: {
      $router: mockRouter,
    },
});
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('functionality', () => {
    describe('router.back', () => {
      it('calls the back function', () => {
        const link = wrapper.find('.govuk-back-link');
        link.trigger('click');
        expect(mockRouter.back).toHaveBeenCalled();
      });
    });
  });
});
