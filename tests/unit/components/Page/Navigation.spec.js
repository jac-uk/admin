import { shallowMount } from '@vue/test-utils';
import Navigation from '@/components/Page/Navigation';

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

describe('components/Page/Navigation', () => {
  it('renders the component', () => {
    let wrapper = createTestSubject({ data: navPages });
    expect(wrapper.exists()).toBe(true);
  });

  describe('properties', () => {
    let prop;

    describe('data', () => {
      beforeEach(() => {
        prop = Navigation.props.data;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('should be array', () => {
        expect(prop.type).toBe(Array);
      });
    });

    describe('label', () => {
      beforeEach(() => {
        prop = Navigation.props.label;
      });

      it('is optional', () => {
        expect(prop.required).not.toBe(true);
      });

      it('has default value', () => {
        expect(prop.default).toBe('navigation');
      });

      it('should be string', () => {
        expect(prop.type).toBe(String);
      });
    });
  });

  describe('markup', () => {
    it('renders data that is passed as prop', () => {
      let wrapper = createTestSubject({ data: navPages });
      expect(wrapper.findAll('li').length).toBe(2);
    });

    it('does not render if data array is empty', () => {
      let wrapper = createTestSubject({ data: [] });
      expect(wrapper.findAll('li').length).toBe(0);
    });

    it('sets aria-label with label prop', () => {
      let wrapper = createTestSubject({ data: navPages, label: 'MyTestLabel' });
      expect(wrapper.find('nav').attributes('aria-label')).toBe('MyTestLabel');
    });
  });

  describe('Accessibility', () => {
    describe('aria-current attribute', () => {
      it('is set for a link which is currently active', () => {
        let wrapper = createTestSubject({ data: navPages });
        let links = wrapper.findAll('.nav-link');
        expect(links.at(0).attributes()).toHaveProperty('aria-current');
        expect(links.at(1).attributes()).not.toHaveProperty('aria-current');
      });
    });
  });
});
