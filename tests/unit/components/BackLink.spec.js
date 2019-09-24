import { shallowMount } from '@vue/test-utils';
import BackLink from '@/components/BackLink';

describe('components/BackLink', () => {
  let wrapper;
  let link;
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallowMount(BackLink, {
      mocks: {
        $router: mockRouter,
      },
    });
    link = wrapper.find('.govuk-back-link');
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders a GOV.UK Back link', () => {
    expect(link.is('.govuk-back-link')).toBe(true);
    expect(link.text()).toBe('Back');
  });

  it('calls $router.back() on click', () => {
    link.trigger('click');
    expect(mockRouter.back).toHaveBeenCalled();
  });
});
