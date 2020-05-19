import { createTestSubject } from '../../helpers';

import FormField from '@/components/Form/FormField';

describe('components/Form/FormField', () => {

  describe('props', () => {
    let prop;
    describe('id', () => {
      beforeEach(() => {
        prop = FormField.props.id;
      });
      it('is required', () => {
        expect(prop.required).toBeTruthy();
      });
      it('is a string', () => {
        expect(prop.type()).toBeString();
      });
      it('defaults as an empty string', () => {
        expect(prop.default).toBe('');
      });
    });
    
    describe('label', () => {
      beforeEach(() => {
        prop = FormField.props.label;
      });
      it('is not required', () => {
        expect(prop.required).toBeFalsy();
      });
      it('is a string', () => {
        expect(prop.type()).toBeString();
      });
      it('defaults as an empty string', () => {
        expect(prop.default).toBe('');
      });
    });

    describe('hint', () => {
      beforeEach(() => {
        prop = FormField.props.hint;
      });
      it('is not required', () => {
        expect(prop.required).toBeFalsy();
      });
      it('is a string', () => {
        expect(prop.type()).toBeString();
      });
      it('defaults as an empty string', () => {
        expect(prop.default).toBe('');
      });
    });

    describe('messages', () => {
      beforeEach(() => {
        prop = FormField.props.messages;
      });
      it('is not required', () => {
        expect(prop.required).toBeFalsy();
      });
      it('is an Object', () => {
        expect(prop.type()).toBeObject();
        });
        it('defaults as an empty Object', () => {
            expect(prop.default()).toEqual({});
        });
    });

    xdescribe('required', () => {
      beforeEach(() => {
        prop = FormField.props.required;
      });
        it('is not required', () => {
            expect(prop.required).toTruthy();
        });
        it('is a Boolean', () => {
          expect(prop.type()).toBeBoolean();
        });
        it('defaults as undefined', () => {
            expect(prop.default).toBe(undefined);
        });
    });

    describe('minLength', () => {
      beforeEach(() => {
        prop = FormField.props.minLength;
      });
        it('is required', () => {
            expect(prop.required).toBeFalsy();
        });
        it('is a Number', () => {
            expect(prop.type()).toBeNumber();
        });
        it('defaults as undefined', () => {
            expect(prop.default).toBe(0);
        });
      });

    describe('maxLength', () => {
      beforeEach(() => {
        prop = FormField.props.maxLength;
      });
      it('is required', () => {
          expect(prop.required).toBeFalsy();
      });
      it('is a Number', () => {
          expect(prop.type()).toBeNumber();
      });
      it('defaults as undefined', () => {
          expect(prop.default).toBe(0);
      });
    });
      
         // @TODO fix these!!
        describe('pattern', () => {
          // it('is an Object', () => {
          //   expect(props.pattern).toBeObject());
          // });
          // it('is a contains match', () => {
          //   expect(props.pattern.match).toBeObject();
          // });
          // it('matches regex formatting', () => {
            //   expect(props.pattern.default()).toEqual({"match": /^/, "message": ""});
            // });
            // //is this good enough? ^^
    });
    
  });

  describe('component instance', () => {
    let wrapper;
    const mockProps = {
      id: 'mockId',
      label: 'mock label',
    };
  
    beforeEach(() => {
      wrapper = createTestSubject(FormField, {
        mocks: {},
        stubs: [],
        propsData: mockProps,
      });
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

  describe('data', () => {
    let data;

    beforeEach(() => {
      data = wrapper.vm.$data;
    });    
    
    it('has errorMessage', () => {
      expect(data).toContainKeys(['errorMessage']);
    });
    it('has checksErrors', () => {
      expect(data).toContainKeys(['checkErrors']);
    });
    it('has regex', () => {
      expect(data).toContainKeys(['checkErrors']);
    });

    describe('errorMessage', () => {
      it('is a String', () => {
        expect(data.errorMessage).toBeString();
      });
      it('empty by default', () => {
        expect(data.errorMessage).toBeFalsy();
      });
    });

    describe('checksErrors', () => {
        it('is a Boolean', () => {
          expect(data.checkErrors).toBeBoolean();
        });
        it('false by default', () => {
          expect(data.checkErrors).toBe(false);
        });
    });

    describe('regex', () => {
        it('has email and telephone patterns', () => {
          expect(data.regex).toContainAllKeys(['email']);
        });
        it('email matches pattern', () => {
          expect('test@test.com').toMatch(data.regex.email);
        });
        xit('tel matches pattern', () => {
          expect('07123456789').toMatch(data.regex.tel);
        });
    });
  });

  describe('computed', () => {
    describe('hasError', () => {
      it('returns true when there\'s an error', () => {
        wrapper.setData({ errorMessage: 'there is an error' });
        expect(wrapper.vm.hasError).toBeTrue();
      });
      it('returns false when there\'s no error', () => {
        wrapper.setData({ errorMessage: null });
        expect(wrapper.vm.hasError).toBeFalse();
      });
    });
  });

  describe('lifecycle methods?', () => {
    it('on mount', () => {
    });
    it('before destroy', () => {
    });
  });

  describe('methods', () => {
    describe('handleValidate', () => {
      xit('sets checkErrors to true', () => {
        
      });
      xit('calls validate method', () => {
        
      });
    });

    describe('validate', () => {
      describe('when checkErrors is true', () => {
        beforeEach(() => {
          wrapper.setData({ checkErrors: true });
        });
        describe('field required errors', () => {
          beforeEach(() => {
            wrapper.setProps({ required: true });
          });
          xit('when no value given', () => {
            wrapper.vm.validate();
            expect(wrapper.vm.$data.errorMessage).toBe(`Please enter a value for ${mockProps.label}`);
          });
        });
        describe('email errors', () =>{
          xit('when no value given', () => {
          });
        });
        describe('tel errors', () =>{
          xit('when no value given', () => {
          });
        });
        describe('minLength errors', () => {
          beforeEach(() => {
            wrapper.setProps({ minLength: 10 });
          });
          it('errors if value is less than minLength', () => {
            wrapper.vm.validate({
              target: {
                value: '123456789',
              },
              });
            expect(wrapper.vm.$data.errorMessage).toBe(`${mockProps.label} should have 10 or more characters`);
          });
        });
        describe('maxLength errors', () =>{
          beforeEach(() => {
            wrapper.setProps({ maxLength: 10 });
          });
          it('errors if value is more than MaxLength', () => {
            let errormessage = `${mockProps.label} should have 10 or fewer characters`;
            wrapper.vm.validate({
              target: {
                value: errormessage,
              },
            });
            expect(wrapper.vm.$data.errorMessage).toBe(errormessage);
          });
        });
        describe('pattern errors', () =>{
          
        });
      });
      describe('when checkErrors is false', () => {
        beforeEach(() => {
          wrapper.setData({ checkErrors: false });
        });
        xit('does nothing', () => {
          // wrapper.vm.validate();
          // expect(wrapper.vm.$data.errorMessage).toBe('');
        });
      });
    });

    describe('setError', () => {
      beforeEach(() => {
        wrapper.vm.setError('testError');
      });
      it('sets errorMessage', () => {
        expect(wrapper.vm.$data.errorMessage).toBe('testError');
      });

      it('emits $root event', () => {
        const $root = { 
          $emit: jest.fn(),
        };
        const wrapper = createTestSubject(FormField, {
          propsData: mockProps,
          stubs: [],
        });
        wrapper.vm.$root = $root;
      
        wrapper.vm.setError('testError');
      
        expect($root.$emit).toHaveBeenCalled();
      });
    });
});

  /** 
   * @TODO check responds to 'validate' event
   * @TODO check cleans up after itself (i.e. removes event listener for 'validate')
   * @TODO lots of tests for methods, in particular validate() and setError()
   */
  
  });

});
