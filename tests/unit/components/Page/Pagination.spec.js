import { shallowMount } from '@vue/test-utils';

import Pagination from '@/components/Page/Pagination';

const createTestSubject = (propsData) => {
    return shallowMount(Pagination, {
        propsData: {
        ...propsData,
        },
    });
};

const numberOfPages = 10;

describe('components/Page/Pagination', () => {
    let wrapper;
    let next = numberOfPages + 1;
    let previous = 0;
    let lowIndex = 1;

    beforeEach(() => {
        wrapper = createTestSubject({ highIndex: numberOfPages });
    });  

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('properties', () => {
        let prop;
    
        describe('highIndex', () => {
          beforeEach(() => {
            prop = Pagination.props.highIndex;
          });
    
          it('is required', () => {
            expect(prop.required).toBe(true);
          });
    
          it('should be Number', () => {
            expect(prop.type).toBe(Number);
          });
        });

        describe('lowIndex', () => {
            beforeEach(() => {
              prop = Pagination.props.lowIndex;
            });
      
            it('is not required', () => {
              expect(prop.required).toBe(false);
            });
      
            it('should be Number', () => {
              expect(prop.type).toBe(Number);
            });
        });
    });

    describe('markup', () => {

        it('renders correct number of elements', () => {
            // Pages + Next and Previous buttons
            expect(wrapper.findAll('li')).toHaveLength(numberOfPages + 2);
        });

        it('first page active', () => {
            expect(wrapper.findAll('li').at(1).attributes('class')).toContain('moj-pagination__item--active');
        });

        it('previous button', () => {
            expect(wrapper.findAll('li').at(previous).html()).toContain('Previous');
        });

        it('next button', () => {
            expect(wrapper.findAll('li').at(next).html()).toContain('Next');
        });

    });

    describe('change page', () => {

        it('page forward', async () => {
            await wrapper.findAll('a').at(next).trigger('click');
            // Current page is displayed and disabled
            expect(wrapper.findAll('li').at(lowIndex + 1).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            // Page we came from isn't
            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('pointer');
            // Previous is enabled
            expect(wrapper.findAll('a').at(previous).attributes('class')).toContain('pointer');
        });

        it('jump to end', async () => {
            await wrapper.findAll('a').at(numberOfPages).trigger('click');
            // Current page is displayed and disabled
            expect(wrapper.findAll('li').at(numberOfPages).attributes('class')).toContain('moj-pagination__item--active', 'disable');
             // Next is disabled
             expect(wrapper.findAll('a').at(next).attributes('class')).toContain('disable');
        });

        it('jump to middle', async () => {
            await wrapper.findAll('a').at(Math.round(numberOfPages / 2)).trigger('click');
            // Current page is displayed and disabled
            expect(wrapper.findAll('li').at(Math.round(numberOfPages / 2)).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            // Next is enabled
            expect(wrapper.findAll('a').at(next).attributes('class')).toContain('pointer');
            // Previous is enabled
            expect(wrapper.findAll('a').at(previous).attributes('class')).toContain('pointer');
        });

        it('page backwards', async () => {
            await wrapper.findAll('a').at(numberOfPages).trigger('click');
            await wrapper.findAll('a').at(0).trigger('click');
            // Current page is displayed and disabled
            expect(wrapper.findAll('li').at(numberOfPages - 1).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            // Page we came from isn't
            expect(wrapper.findAll('li').at(numberOfPages).attributes('class')).toContain('pointer');
            // Next is enabled
            expect(wrapper.findAll('a').at(next).attributes('class')).toContain('pointer');
            // Previous is enabled
            expect(wrapper.findAll('a').at(previous).attributes('class')).toContain('pointer');
        });

        it('event emitted', async () => {
            await wrapper.findAll('a').at(Math.round(numberOfPages / 4)).trigger('click');
            // Event emitted
            expect(wrapper.emitted().paged).toBeTruthy();
            // Correct event emitted with correct value
            expect(wrapper.emitted('paged')[0][0]).toEqual(Math.round(numberOfPages / 4));
        });
    });
});