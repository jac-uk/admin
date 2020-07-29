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
      it('is a string', () => {
        expect(prop.type()).toBeString();
      });
      it('defaults as', () => {
        expect(prop.default).toBe(null);
      });
    });
    describe('status', () => {
      beforeEach(() => {
        prop = Banner.props.status;
      });
      it('is a string', () => {
        expect(prop.type()).toBeString();
      });
      it('defaults as', () => {
        expect(prop.default).toBe(null);
      });
    });
  });
  
  describe('component instance', () => {
    describe('when status = success', () => {
    const wrapper = createTestSubject({ message: 'mockMessage', status: 'success' });

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
            expect(wrapper.find('svg').attributes('class')).toBe('moj-banner__icon');
          });
          it('fill',() => {
            expect(wrapper.find('svg').attributes('fill')).toBe('currentColour');
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
      });
    });

    describe('when status is empty', () => {
      const wrapper = createTestSubject({ message: 'mockMessage', status: '' });
  
      it('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
      });
  
      describe('template', () => {
        describe('divs', () => {
          describe('container div', () => {
            it('class', () => {
              expect(wrapper.findAll('div').at(0).attributes('class')).toBe('moj-banner');
            });
          });
          describe('message div', () => {
            expect(wrapper.findAll('div').at(1).attributes('class')).toBe('moj-banner__message');
          });
        });

        describe('svg attributes', () => {
          it('class', () => {
            expect(wrapper.find('svg').attributes('class')).toBe('moj-banner__icon');
          });
          it('fill',() => {
            expect(wrapper.find('svg').attributes('fill')).toBe('currentColour');
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
            expect(wrapper.find('svg > path').attributes('d')).toBe('M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8 C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z');
          });
        });

        describe('span', () => {
          it('class', () => {
            expect(wrapper.find('div > span').attributes('class')).toBe('moj-banner__assistive');
          });
          it('contents', () => {
            expect(wrapper.find('div > span').text()).toBe('');
          });
        });
      });
    });
  });
});
