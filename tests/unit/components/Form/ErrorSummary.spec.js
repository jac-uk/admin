import { createTestSubject } from '../../helpers';
import ErrorSummary from '@/components/Form/ErrorSummary';

describe('components/ErrorSummary', () => {

  describe('props', () => {
    describe('errors', () => {
      let prop;
      beforeEach(() => {
        prop = ErrorSummary.props.errors;
      });
      it('is an array', () => {
        expect(prop.type()).toBeArray();
      });
      it('are required', () => {
        expect(prop.required).toBeTruthy();
      });
    });
  });

  describe('component instance', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject(ErrorSummary, {
        mocks: {},
        stubs: [],
        propsData: {
          errors: [],
        },
      });
    });
    
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });
    
    describe('template', () => {
      describe('with errors', () => {
        beforeEach(()=>{
          
        });
        it('template tests', () => {
        });
      });
      describe('with no errors', () => {
        it('list doesn\'nt exist', () =>{
          expect(wrapper.find('div#govuk-error-summary').exists()).toBe(false);
        });
      });
    });
    
  });

});
