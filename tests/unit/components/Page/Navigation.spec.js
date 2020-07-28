import { shallowMount } from '@vue/test-utils';

import Navigation from '@/components/Page/Navigation';

describe('components/Page/Navigation', () => {
const navPages = [
  { page: 'Test', name: 'nav-test-name1' },
  { page: 'Test2', name: 'nav-test-name2' },
];

const createTestSubject = (propsData) => {
  return shallowMount(Navigation, {
    propsData: {
      ...propsData,
    },
    stubs: ['RouterLink'],
    mocks: {
      $route: {
        name: 'nav-test-name1',
      },
    },
  });
};

  it('renders the component', () => {
    const wrapper = createTestSubject({ pages: navPages });
    expect(wrapper.exists()).toBe(true);
  });

  describe('properties', () => {
    let prop;

    describe('pages', () => {
      beforeEach(() => {
        prop = Navigation.props.pages;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('should be array', () => {
        expect(prop.type).toBe(Array);
      });
    });

    describe('title', () => {
      beforeEach(() => {
        prop = Navigation.props.title;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
      });

      it('has default value', () => {
        expect(prop.default).toBe('');
      });

      it('should be string', () => {
        expect(prop.type).toBe(String);
      });
    });
  });

  describe('template', () => {
    it('renders items that is passed as prop', () => {
      const wrapper = createTestSubject({ pages: navPages });
      expect(wrapper.findAll('li').length).toBe(2);
    });

    it('does not render if items array is empty', () => {
      const wrapper = createTestSubject({ pages: [] });
      expect(wrapper.findAll('li').length).toBe(0);
    });

    it('sets aria-label with label prop', () => {
      const wrapper = createTestSubject({ pages: navPages, title: 'MyTestLabel' });
      expect(wrapper.find('nav').attributes('aria-label')).toBe('MyTestLabel');
    });

    xdescribe('aria-current attribute', () => {
      it('is set for a link which is currently active', () => {
        const wrapper = createTestSubject({ items: navPages });
        const links = wrapper.findAll('.nav-link');
        expect(links.at(0).attributes()).toHaveProperty('aria-current');
        expect(links.at(1).attributes()).not.toHaveProperty('aria-current');
      });
    });
  });
});
