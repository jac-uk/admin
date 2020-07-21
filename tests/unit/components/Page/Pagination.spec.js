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
        wrapper = createTestSubject({ highIndex: numberOfPages, lowIndex: lowIndex });
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

        it('no other page active', () => {
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('previous button', () => {
            expect(wrapper.findAll('li').at(previous).html()).toContain('Previous');
        });

        it('next button', () => {
            expect(wrapper.findAll('li').at(next).html()).toContain('Next');
        });

    });

    describe('does not start at 1', () => {
        const numberOfPages =  6;
        const lowIndexNew = 5;
        const highIndexNew = 10;

        beforeEach(() => {
            wrapper = createTestSubject({ highIndex: highIndexNew, lowIndex: lowIndexNew });
        }); 
        it('renders correct number of elements', () => {
            // Pages + Next and Previous buttons
            expect(wrapper.findAll('li')).toHaveLength(numberOfPages + 2);
        });

        it('first page active', () => {
            expect(wrapper.findAll('li').at(1).attributes('class')).toContain('moj-pagination__item--active');
        });

        it('no other page active', () => {
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });
    });

    describe('single page', () => {
        const lowIndexNew = 1;
        const highIndexNew = 1;

        beforeEach(() => {
            wrapper = createTestSubject({ highIndex: highIndexNew, lowIndex: lowIndexNew });
        }); 

        it('does not render any elements', () => {
            expect(wrapper.findAll('li')).toHaveLength(0);
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
            expect(wrapper.emitted().pageChanged).toBeTruthy();
            // Correct event emitted with correct value
            expect(wrapper.emitted('pageChanged')[0][0]).toEqual(Math.round(numberOfPages / 4));
        });

        it('event not emitted', async () => {
            await wrapper.findAll('a').at(previous).trigger('click');
            // Event not emitted (as we don't go backwards)
            expect(wrapper.emitted().pageChanged).toBeFalsy();
        });

    });

    describe('unexpected inputs', () => {
        it('cannot go off the start of the array', async () => {
            await wrapper.findAll('a').at(previous).trigger('click');
            // Still on the first page 
            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            // No other page active 
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('cannot go off the end of the array', async () => {
            await wrapper.findAll('a').at(Math.round(numberOfPages)).trigger('click');
            await wrapper.findAll('a').at(next).trigger('click');
            // Still on the last page 
            expect(wrapper.findAll('li').at(numberOfPages).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            // No other page active 
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('cannot change page exceeding array', async () => {
            await wrapper.vm.changePage(numberOfPages * 5);

            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('cannot change page inversely exceeding array', async () => {
            await wrapper.vm.changePage(numberOfPages * -5);

            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('float input does not change page', () => {
            expect(() => {
                wrapper.vm.changePage(lowIndex + 0.5);
            }).toThrow('Invalid direction');

            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('null input does not change page', () => {
            expect(() => {
                wrapper.vm.changePage(null);
            }).toThrow('Invalid direction');

            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });

        it('invalid string input does not change page', () => {
            expect(() => {
                wrapper.vm.changePage('test');
            }).toThrow('Invalid direction');

            expect(wrapper.findAll('li').at(lowIndex).attributes('class')).toContain('moj-pagination__item--active', 'disable');
            expect(wrapper.findAll('li.moj-pagination__item--active')).toHaveLength(1);
        });
    });
});
