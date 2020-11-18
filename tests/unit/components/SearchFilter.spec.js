import { createTestSubject } from '../helpers';
import SearchFilter from '@/components/SearchFilter';

describe('components/SearchFilter', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = createTestSubject(SearchFilter, { 
      propsData: {
        terms: [
          {
            type: 'status',
            options: ['one', 'two', 'three'],
          },
          {
            type: 'other',
            options: ['one', 'two', 'three'],
          },
          {
            type: 'more',
            options: ['one', 'two', 'three'],
          },
        ],  
      },
      stubs: [],
      mocks: [],
    });
  }); 

  it('renders the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });
  
  describe('template', () => {
    
    describe('when showTab is false', () => {
      beforeEach(() => {
        wrapper.setData({
          showTab: false,
        });
      });
      
      it('shows \'show filter\' button', () => {
        expect(wrapper.find('.container').exists()).toBeFalse();
      });
      
      it('does not show filter tab', () => {
        expect(wrapper.find('.container').exists()).toBeFalse();
      });
      
      it('toggles showTab on click', () => {
        wrapper.find('.button-section .govuk-button').trigger('click');
        expect(wrapper.vm.showTab).toBe(true);
      });
      
    });

    describe('when showTab is true', () => {
      beforeEach(() => {
        wrapper.setData({
          showTab: true,
        });
      });

      it('shows filter tab', () => {
        expect(wrapper.find('.container').exists()).toBeTrue();
      });

      it('toggles showTab on click', () => {
        wrapper.find('.button-section .govuk-button').trigger('click');
        expect(wrapper.vm.showTab).toBe(false);
      });
    });
  });
  
});
