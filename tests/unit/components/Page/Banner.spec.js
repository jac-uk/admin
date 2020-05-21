// @TODO@ import monikas test helpers
const createTestSubject = (propsData) => {
  return shallowMount(Banner, {
    propsData: {
      ...propsData,
    },
    stubs: ['RouterLink'],
  });
};

import { shallowMount } from '@vue/test-utils';

import Banner from '@/components/Page/Banner';

describe('components/Page/Banner', () => {
  describe('props', () => {
    let prop;
    describe('message', () => {
      beforeEach(() => {
        prop = Banner.props.message;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });   
      it('is a string', () => {
          expect(prop.type()).toBeString();
      });
    });
  });
  
  describe('component instance', () => {
    // describe('success', () => {
    let wrapper = createTestSubject({ message: 'mockMessage'});

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('template', () => {
      describe('divs', () => {
        describe('container div', () => {
          it('class', () => {
            expect(wrapper.findAll('div').at(0).attributes('class')).toBe('moj-banner moj-banner--success');
          });
        });
        describe('message div', () => {
          expect(wrapper.findAll('div').at(1).attributes('class')).toBe('moj-banner__message');
        });
      });
      describe('svg attributes', () => {
        it('class', () => {
          expect(wrapper.find('svg').attributes('class')).toBe('moj-banner_icon');
        });
        it('fill',() => {
          expect(wrapper.find('svg').attributes('fill')).toBe('CurrentColour');
        });
        it('role', () => {
          expect(wrapper.find('svg').attributes('role')).toBe('presentation');
        });
        it('focusable ',() => {
          expect(wrapper.find('svg').attributes('focusable')).toBe('false');
        });
        it('xmlns', () => {
          expect(wrapper.find('svg').attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
        });
        it('fill',() => {
          expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 25 25');
        });
        it('class', () => {
          expect(wrapper.find('svg').attributes('height')).toBe('25');
        });
        it('fill',() => {
          expect(wrapper.find('svg').attributes('width')).toBe('25');
        });
      });
      describe('path', () => {
        it('d attribute', () => {
          expect(wrapper.find('svg > path').attributes('d')).toBe('M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z');
        });
      });
      describe('span', () => {
        it('class', () => {
          expect(wrapper.find('div > span').attributes('class')).toBe('moj-banner__assistive');
        });
        it('contents', () => {
          expect(wrapper.find('div > span').text()).toBe('success');
        });
      });
      
    // });
    });
  });
});
