import { createTestSubject } from '../../helpers';
import DateInput from '@/components/Form/DateInput';

xdescribe('components/DateInput', () => {
  
  describe('props', () => {
    describe('type', () => {
      let prop;
      beforeEach(()=>{
        prop = DateInput.props.type;
      });
      it('defaults as date', () => {
        expect(prop.default).toBe('date');
      });
      it('validator accepts \'date\' string', () => {
        expect(prop.validator('date')).toBe(true);
      });
      it('validator accepts \'month\' string', () => {
        expect(prop.validator('month')).toBe(true);
      });
      it('validator rejects anything not \'date\' or \'month\' string', () => {
        expect(prop.validator('day')).toBe(false);
      });
    });
    describe('value', () => {
      let prop;
      beforeEach(()=>{
        prop = DateInput.props.value;
      });
      it('is required', () => {
        expect(prop.required).toBe(true);
      });
      it('Value must be an instance of date', () => {
        const prop = DateInput.props.value;
        expect(prop.validator(new Date)).toBe(true);
      });
      it('Value must be an instance of date', () => {
        const prop = DateInput.props.value;
        expect(prop.validator(!Date)).toBe(false);
      });
    });
  });

  describe('component instance', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject(DateInput, {
        mocks: {},
        stubs: [],
        propsData: {
          id: '1',
          value: new Date,
        },
      });
    });

  describe('template', () => {

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('form-group div', () => {
      xit('errors', () => {
        wrapper.setProps({ hasError: true });
        expect(wrapper.find('div.govuk-form-group--error').exists()).toBe(true);
      });
      it('exists with no errors', () => {
        expect(wrapper.find('div.govuk-form-group').exists()).toBe(true);
      });
    });

    describe('hint', () => {
      it('displays span hint if provided ans sets text', () => {
        const hint = 'For example, 31 05 2020 at 09:00';
        wrapper.setProps({ hint, id: 'testid' });
        expect(wrapper.find('#testid-hint').exists()).toBe(true);
        expect(wrapper.find('#testid-hint').text()).toBe(hint);
      });

      it('sets aria-describedby with the value of hint id', () => {
        const hint = 'For example, 31 05 2020 at 09:00';
        wrapper.setProps({ hint, id: 'testid' });
        expect(wrapper.find('.govuk-fieldset').attributes('aria-describedby')).toBe('testid-hint');
      });

      it('does not display hint if not not provided', () => {
        wrapper.setProps({ id: 'testid' });
        expect(wrapper.find('#testid-hint').exists()).toBe(false);
      });
    });

    describe('label', () => {
      it('sets legend', () => {
        const label = 'Launch date and time';
        wrapper.setProps({ label });
        expect(wrapper.find('.govuk-fieldset__legend').text()).toBe(label);
        });
    });

    describe('id', () => {
      it('assigns id to govuk-date-input', () => {
        const id = 'launch_date';
        wrapper.setProps({ id });
        expect(wrapper.find('.govuk-date-input').attributes().id).toBe(id);
      });
      it('is used to create if for inputs', () => {
        const id = 'launch_date';
        wrapper.setProps({ id });
        expect(wrapper.findAll('.govuk-date-input__input').at(0).attributes().id).toBe(`${id}-day`);
        expect(wrapper.findAll('.govuk-date-input__input').at(1).attributes().id).toBe(`${id}-month`);
        expect(wrapper.findAll('.govuk-date-input__input').at(2).attributes().id).toBe(`${id}-year`);
      });

      it('is used to create for attributes', () => {
        const id = 'launch_date';
        wrapper.setProps({ id });
        expect(wrapper.findAll('.govuk-date-input__label').at(0).attributes().for).toBe(`${id}-day`);
        expect(wrapper.findAll('.govuk-date-input__label').at(1).attributes().for).toBe(`${id}-month`);
        expect(wrapper.findAll('.govuk-date-input__label').at(2).attributes().for).toBe(`${id}-year`);
      });
    });

  });

  describe('computed properties', () => {
    describe('dayInput', () => {
        describe('getter', () => {
        describe('given `day` is null', () => {
          it('returns null', () => {
            wrapper.setData({ day: null });
            expect(wrapper.vm.dayInput).toBe(null);
          });
        });
        describe('given `day` is a number', () => {
          it('returns `day` as a string', () => {
            wrapper.setData({ day: 15 });
            const value = wrapper.vm.dayInput;
            expect(typeof value).toBe('string');
            expect(value).toBe('15');
            expect(parseInt(value)).toBe(15);
          });
      });
        it('zero pads single digit values to 2 characters', () => {
            wrapper.setData({ day: 1 });
            const value = wrapper.vm.dayInput;

            expect(typeof value).toBe('string');
            expect(value).toBe('01');
            expect(value).toHaveLength(2);
          });
        });
        describe('setter', () => {
          describe('given a non-numeric value', () => {
            it('sets `day` to null', () => {
              wrapper.vm.dayInput = 'a string';
              expect(wrapper.vm.day).toBe(null);
            });
          });
          describe('given a numeric string', () => {
            it('sets `day` to the integer value of the string', () => {
              wrapper.vm.dayInput = '7';
              expect(wrapper.vm.day).toBe(7);
            });
          });
          describe('upper bound of 31', () => {
            it('rewrites values over 31 as 31', () => {
              wrapper.vm.dayInput = '45';
              expect(wrapper.vm.day).toBe(31);
            });
          });
          describe('lower bound of 1', () => {
            it('rewrites zero values as 1', () => {
              wrapper.vm.dayInput = '0';
              expect(wrapper.vm.day).toBe(1);
            });
            it('rewrites negative values as 1', () => {
              wrapper.vm.dayInput = '-10';
              expect(wrapper.vm.day).toBe(1);
            });
          });
        });
      });
    describe('monthInput', () => {
        describe('getter', () => {
          describe('given `month` is null', () => {
            it('returns null', () => {
              wrapper.setData({ month: null });
              expect(wrapper.vm.monthInput).toBe(null);
            });
          });
          describe('given `month` is a number', () => {
            it('returns `month` as a string', () => {
              wrapper.setData({ month: 10 });
              const value = wrapper.vm.monthInput;
              expect(typeof value).toBe('string');
              expect(value).toBe('10');
              expect(parseInt(value)).toBe(10);
            });
            it('zero pads single digit values to 2 characters', () => {
              wrapper.setData({ month: 1 });
              const value = wrapper.vm.monthInput;
              expect(typeof value).toBe('string');
              expect(value).toBe('01');
              expect(value).toHaveLength(2);
            });
          });
        });
        describe('setter', () => {
          describe('given a non-numeric value', () => {
            it('sets `month` to null', () => {
              wrapper.vm.monthInput = 'a string';
              expect(wrapper.vm.month).toBe(null);
            });
          });
          describe('given a numeric string', () => {
            it('sets `month` to the integer value of the string', () => {
              wrapper.vm.monthInput = '7';
              expect(wrapper.vm.month).toBe(7);
            });
          });
          describe('upper bound of 12', () => {
            it('rewrites values over 12 as 12', () => {
              wrapper.vm.monthInput = '45';
              expect(wrapper.vm.month).toBe(12);
            });
          });
          describe('lower bound of 1', () => {
            it('rewrites zero values as 1', () => {
              wrapper.vm.monthInput = '0';
              expect(wrapper.vm.month).toBe(1);
            });
            it('rewrites negative values as 1', () => {
              wrapper.vm.monthInput = '-10';
              expect(wrapper.vm.month).toBe(1);
            });
          });
        });    
      });
    describe('yearInput', () => {
        describe('getter', () => {
          describe('given `year` is null', () => {
            it('returns null', () => {
              wrapper.setData({ year: null });
              expect(wrapper.vm.yearInput).toBe(null);
            });
          });
  
          describe('given `year` is a number', () => {
            it('returns `year` as a number', () => {
              wrapper.setData({ year: 1986 });
              const value = wrapper.vm.yearInput;
  
              expect(typeof value).toBe('number');
              expect(value).toBe(1986);
            });
          });
        });
  
        describe('setter', () => {
          describe('given a non-numeric value', () => {
            it('sets `year` to null', () => {
              wrapper.vm.yearInput = 'a string';
              expect(wrapper.vm.year).toBe(null);
            });
          });
  
          describe('given a numeric string', () => {
            it('sets `year` to the integer value of the string', () => {
              wrapper.vm.yearInput = '1986';
              expect(wrapper.vm.year).toBe(1986);
            });
          });
        });
      });
    describe('dateConstructor', () => {
      describe('and `day`, `month` and `year` fields are set', () => {
        it('returns an array of Date constructor arguments', () => {
          wrapper.setData({ day: 12, month: 4, year: 1980 });
            expect(wrapper.vm.dateConstructor).toHaveLength(3);
            expect(wrapper.vm.dateConstructor).toEqual([1980, 3, 12]);
          });
        
          it('adjusts month to be zero-indexed, as required by Date constructor', () => {
            wrapper.setData({ day: 1, month: 1, year: 1960 });
            expect(wrapper.vm.dateConstructor).toEqual([1960, 0, 1]);
        
            wrapper.setData({ day: 25, month: 12, year: 1960 });
            expect(wrapper.vm.dateConstructor).toEqual([1960, 11, 25]);
          });
      });
        
      describe('given property type="month"', () => {
        beforeEach(() => {
          wrapper.setProps({ type: 'month' });
        });
        
        describe('and `month` and `year` fields are set', () => {
          it('returns an array of Date constructor arguments', () => {
            wrapper.setData({ month: 4, year: 1980 });
            expect(wrapper.vm.dateConstructor).toHaveLength(3);
            expect(wrapper.vm.dateConstructor).toEqual([1980, 3, 1]);
          });
          
          it('adjusts month to be zero-indexed, as required by Date constructor', () => {
            wrapper.setData({ month: 1, year: 1960 });
            expect(wrapper.vm.dateConstructor).toEqual([1960, 0, 1]);
            wrapper.setData({ month: 12, year: 1960 });
            expect(wrapper.vm.dateConstructor).toEqual([1960, 11, 1]);
          });
        });
      });
      
      describe('given at least one field is null', () => {
        const nullValueCombinations = [
          ['`day` is null',                      { day: null, month: 4,    year: 1980 }],
          ['`month` is null',                    { day: 12,   month: null, year: 1980 }],
          ['`year` is null',                     { day: 12,   month: 4,    year: null }],
          ['`day` and `month` are null',         { day: null, month: null, year: 1980 }],
          ['`day` and `year` are null',          { day: null, month: 4,    year: null }],
          ['`month` and `year` are null',        { day: 12,   month: null, year: null }],
          ['`day`, `month` and `year` are null', { day: null, month: null, year: null }],
        ];
        
        it.each(nullValueCombinations)('returns null (%s)', (label, data) => {
          wrapper.setData(data);
          expect(wrapper.vm.dateConstructor).toBe(null);
        });
      });
    });    
    describe('date', () => {
      describe('getter', () => {
          describe('given the date is not set (`dateConstructor` returns null)', () => {
            it('returns null', () => {
              wrapper.setData({ day: null, month: null, year: null });
              expect(wrapper.vm.date).toBe(null);
            });
          });
          describe('given a date is set (`dateConstructor` returns constructor args)', () => {
            it('returns a Date object', () => {
              expect(wrapper.vm.date).toBeInstanceOf(Date);
            });
              
            it('is created as a UTC Date', () => {
              wrapper.setData({ day: 1, month: 6, year: 2018 });
              const args = wrapper.vm.dateConstructor;
              const utcTime = Date.UTC(...args);
              expect(wrapper.vm.date.getTime()).toEqual(utcTime);
            });
          });
        });

        describe('setter', () => {
          describe('given a non-Date value', () => {
            it('does nothing', () => {
              wrapper.setData({ day: 17, month: 5, year: 2018 });
              wrapper.vm.date = null;
              expect(wrapper.vm.day).toBe(17);
              expect(wrapper.vm.month).toBe(5);
              expect(wrapper.vm.year).toBe(2018);
            });
          });
          describe('given a Date object', () => {
            beforeEach(() => {
              wrapper.vm.date = new Date(Date.UTC(2018, 5, 17));
            });
            it("sets `day` to the Date object's UTC date", () => {
              expect(wrapper.vm.day).toBe(17);
            });
            it("sets `month` to the Date object's UTC month +1 (so it's not zero-indexed)", () => {
              expect(wrapper.vm.month).toBe(6);
            });
            it("sets `year` to the Date object's UTC full year", () => {
              expect(wrapper.vm.year).toBe(2018);
            });
          });
        });
      });
  });

  describe('`v-model` interface', () => {
    describe('when the `value` property changes', () => {
      let realDateSetter;
      let mockDateSetter;
      let firstDate;
      let secondDate;
      beforeEach(() => {
        // Mock the date setter
        realDateSetter = DateInput.computed.date.set;
        mockDateSetter = jest.fn();
        DateInput.computed.date.set = mockDateSetter;
      });
      
      afterEach(() => {
        DateInput.computed.date.set = realDateSetter;
      });
      
      describe('given the new `value` is different from the current `date`', () => {
        it('sets `date` to equal the new `value`', () => {
          firstDate = new Date('1960-01-01');
          secondDate = new Date('1975-04-19');
          wrapper = createTestSubject(DateInput, {
            mocks: {},
            stubs: [],
            propsData: {
              id: '1',
              value: firstDate,
            },
          });
          wrapper.setProps({ value: secondDate });
          expect(mockDateSetter).toHaveBeenCalledTimes(2);
          expect(mockDateSetter).toHaveBeenNthCalledWith(1, firstDate);
          expect(mockDateSetter).toHaveBeenNthCalledWith(2, secondDate);
        });
      });

      describe('given the new `value` is the same as the current `date`', () => {
        it('avoids an infinite feedback loop by doing nothing (does not set `date`)', () => {
          // Two equal dates as different objects
          firstDate = new Date('1960-01-01');
          secondDate = new Date('1960-01-01');
          wrapper = createTestSubject(DateInput, {
            mocks: {},
            stubs: [],
            propsData: {
              id: '1',
              value: firstDate,
            },
          });
          wrapper.setProps({ value: secondDate });
          expect(mockDateSetter).toHaveBeenCalledTimes(1);
          expect(mockDateSetter.mock.calls[0][0]).toBe(firstDate);
          expect(mockDateSetter.mock.calls[0][0]).not.toBe(secondDate);
        });
      });
    });
    
    describe('when the internal `date` Date object changes', () => {
      it('emits an `input` event', () => {
        const newDate = new Date('1985-06-17');
        wrapper.vm.date = newDate;
        const emitted = wrapper.emitted().input;
        expect(emitted.length).toBeGreaterThan(0);
        expect(emitted).toContainEqual([newDate]);
      });
    });
    });

    describe('#created lifecycle hook', () => {
    it('sets `date` to equal the `value` property', () => {
      const value = new Date('1960-01-01');
      wrapper.setProps({ value: value });
      expect(wrapper.vm.date).not.toBe(value);
      expect(wrapper.vm.date).toEqual(value);
    });
    });
    
    describe('input fields', () => {
      beforeEach(() => {
        wrapper.setProps({ value: new Date('2018-01-01') });
      });

      describe('given property type="date"', () => {
        describe('Day input', () => {
          let input;
          beforeEach(() => {
            input = wrapper.find({ ref: 'dayInput' });
          });

        describe('is lazily bound to `dayInput`', () => {
                it('displays the value of `dayInput`', () => {
                  expect(input.element.value).toBe(wrapper.vm.dayInput);
                });
                it('updates `dayInput` on change', () => {
                  input.element.value = '12';
                  input.trigger('change');
                  expect(wrapper.vm.dayInput).toBe('12');
                });
                it('does nothing on input/keypress', () => {
                  input.element.value = '12';
                  input.trigger('input');
                  expect(wrapper.vm.dayInput).not.toBe('12');
                  expect(wrapper.vm.dayInput).toBe('01');
                });
              });
            });
          });
        
          describe('given property type="month"', () => {
            beforeEach(() => {
              wrapper.setProps({ type: 'month' });
            });
        
          describe('Day input', () => {
            it('is not rendered', () => {
              const input = wrapper.find({ ref: 'dayInput' });
              expect(input.exists()).toBe(false);
            });
          });
        });
        
        describe('Month input', () => {
          let input;
          beforeEach(() => {
            input = wrapper.find({ ref: 'monthInput' });
          });
        
              describe('is lazily bound to `monthInput`', () => {
                it('displays the value of `monthInput`', () => {
                  expect(input.element.value).toBe(wrapper.vm.monthInput);
                });
                it('updates `monthInput` on change', () => {
                  input.element.value = '6';
                  input.trigger('change');
                  expect(wrapper.vm.monthInput).toBe('06');
                });
                it('does nothing on input/keypress', () => {
                  input.element.value = '6';
                  input.trigger('input');
                  expect(wrapper.vm.monthInput).not.toBe('6');
                  expect(wrapper.vm.monthInput).toBe('01');
                });
              });
            });
        
            describe('Year input', () => {
              let input;
              beforeEach(() => {
                input = wrapper.find({ ref: 'yearInput' });
              });
        
              describe('is lazily bound to `yearInput`', () => {
                it('displays the value of `yearInput`', () => {
                  expect(input.element.value).toBe(wrapper.vm.yearInput.toString());
                });
                it('updates `yearInput` on change', () => {
                  input.element.value = '2010';
                  input.trigger('change');
                  expect(wrapper.vm.yearInput).toBe(2010);
                });
                it('does nothing on input/keypress', () => {
                  input.element.value = '2008';
                  input.trigger('input');
                  expect(wrapper.vm.yearInput).not.toBe('2008');
                  expect(wrapper.vm.yearInput).toBe(2018);
                  });
                });
              });    
              
    });
  });

});
