import { createTestSubject } from '../helpers';
import SearchFilter from '@/components/SearchFilter';

describe('components/SearchFilter', () => {
  let wrapper;

  describe('props', () => {
    let prop;
    describe('terms', () => {
      beforeEach(() => {
        prop = SearchFilter.props.terms;
      });

      it('are required', () => {
        expect(prop.required).toBe(true);
      });

      // const validTypes = [
      //   ['an Array', ['one', 2]],
      //   ['an empty Array', []],
      //   ['null', null],
      //   ['undefined', undefined],
      // ];

      // it.each(validTypes)('can be %s', (label, value) => {
      //   const valid = prop.validator(value);
      //   expect(valid).toBe(true);
      // });
      // @todo add validation and tests for validation

    //   const invalidTypes = [
    //     ['a String', 'hello'],
    //     ['an empty String', ''],
    //     ['a Number', 5],
    //     ['an Object', { one: 1, two: 2 }],
    //     ['a Date object', new Date()],
    //     ['Boolean true', true],
    //     ['Boolean false', false],
    //   ];

    //   it.each(invalidTypes)('cannot be %s', (label, value) => {
    //     const valid = prop.validator(value);
    //     expect(valid).toBe(false);
    //   });
    // });

    });
  });

  describe('template', () => {
    beforeEach(() => {
      wrapper = createTestSubject(SearchFilter, { 
        propsData: {
          terms: [
          //     {
          //       type: 'checkbox',
          //       title: 'Checkbox',
          //       options: ['one', 'two', 'three'],
          //     },
          //     {
          //       type: 'keyword',
          //       title: 'Keyword',
          //     },
          //     {
          //       type: 'dateRange',
          //       title: 'Open Date',
          //     },
            ],
        },
        stubs: [],
        mocks: [],
      });
    }); 
  
    it('renders the component', () => {
      expect(wrapper.exists()).toBeTruthy();
    });
    
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

      it('button text is \'Show filters\'', () => {
        expect(wrapper.find('div .govuk-button').text()).toBe('Show filters');
      });
      
      it('toggles showTab on click', () => {
        wrapper.find('div .govuk-button').trigger('click');
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

      it('button text is \'Hide filters\'', () => {
        expect(wrapper.find('div .govuk-button').text()).toBe('Hide filters');
      });
      
      it('toggles showTab on click', () => {
        wrapper.find('div .govuk-button').trigger('click');
        expect(wrapper.vm.showTab).toBe(false);
      });

      describe('when given \'checkbox\' type term ', () => {

        beforeEach(()=>{
          wrapper.setProps({ terms: [
            {
              type: 'checkbox',
              title: 'Checkbox',
              options: ['one', 'two', 'three'],
            },
          ] });
        });

        it('renders a checkboxgroup for each term with \'checkbox\' type', () => {
          expect(wrapper.find('checkboxgroup-stub').exists()).toBeTrue();
        });

        it('doesn\'t render a dateinput', () => {
          expect(wrapper.findAll('dateinput-stub').length).toBe(0);
        });

        it('doesn\'t render a textfield', () => {
          expect(wrapper.find('textfield-stub').exists()).not.toBeTrue();
        });

        it('renders a checkboxitem for each option within \'checkbox\' term', () => {
          expect(wrapper.findAll('checkboxitem-stub').length).toBe(3);
        });

        it('renders a checkboxitem for each option within \'checkbox\' term', () => {
          wrapper.setProps({ terms: [
            {
              type: 'checkbox',
              title: 'Checkbox',
              options: ['one', 'two', 'three'],
            },
            {
              type: 'checkbox',
              title: 'Checkbox 2',
              options: ['one', 'two', 'three'],
            },
          ] });
          expect(wrapper.findAll('checkboxgroup-stub').length).toBe(2);
        });

      });

      describe('when given \'keyword\' type term ', () => {

        beforeEach(()=>{
          wrapper.setProps({ terms: [{
            type: 'keyword',
            title: 'Keyword',
          }] });
        });

        it('doesn\'t render a checkboxgroup', () => {
          expect(wrapper.find('checkboxgroup-stub').exists()).not.toBeTrue();
        });

        it('doesn\'t render a dateinput', () => {
          expect(wrapper.findAll('dateinput-stub').length).toBe(0);
        });

        it('renders a textfield', () => {
          expect(wrapper.find('textfield-stub').exists()).toBeTrue();
        });

      });

      describe('when given \'dateRange\' type term ', () => {

        beforeEach(()=>{
          wrapper.setProps({ terms: [{
            type: 'dateRange',
            title: 'open Date',
          }] });
        });

        it('doesn\'t render a checkboxgroup', () => {
          expect(wrapper.find('checkboxgroup-stub').exists()).not.toBeTrue();
        });

        it('doesn\'t render a textfield', () => {
          expect(wrapper.find('textfield-stub').exists()).not.toBeTrue();
        });

        it('renders two dateinputs (from and to)', () => {
          expect(wrapper.findAll('dateinput-stub').length).toBe(2);
        });

      });
      
      describe('combinations of terms', () => {

        it('can render multiples of all', () => {
          wrapper.setProps({ terms: [
            {
              type: 'checkbox',
              title: 'Status',
              options: ['one', 'two', 'three'],
            },
            {
              type: 'checkbox',
              title: 'Status1',
              options: ['one', 'two', 'three'],
            },
            {
              type: 'keyword',
              title: 'keyword',
            },
            {
              type: 'keyword',
              title: 'keyword2',
            },
            {
              type: 'dateRange',
              title: 'open Date',
            },
            {
              type: 'dateRange',
              title: 'Close Date',
            },
          ] });
          expect(wrapper.findAll('checkboxgroup-stub').length).toBe(2);
          expect(wrapper.findAll('textfield-stub').length).toBe(2);
          expect(wrapper.findAll('dateinput-stub').length).toBe(4);
        });

      });
    });
    
  });
});

