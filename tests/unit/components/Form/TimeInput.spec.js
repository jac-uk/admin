import { createTestSubject } from '../../helpers';
import TimeInput from '@/components/Form/TimeInput';
import zeroPad from '@/helpers/Form/zeroPad';
import parseAndClipNumber from '@/helpers/Form/parseAndClipNumber';

jest.mock('@/helpers/Form/zeroPad', () => {
  return jest.fn().mockImplementation(() => {
    jest.fn();
  });
});

jest.mock('@/helpers/Form/parseAndClipNumber', () => {
  return jest.fn().mockImplementation(() => {
    jest.fn();
  });
});

describe('components/TimeInput', () => {

  describe('props', () => {
    let prop;

    describe('value', () => {
      beforeEach(() => {
        prop = TimeInput.props.value;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      const validTypes = [
        ['null', null],
        ['undefined', undefined],
        ['a Date object', new Date()],
      ];

      it.each(validTypes)('can be %s', (label, value) => {
        const valid = prop.validator(value);
        expect(valid).toBe(true);
      });
    });

  });

  describe('component instance', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = createTestSubject(TimeInput, {
        propsData: {
          value: new Date(),
          id: 'launch_time',
        },
        mocks: {},
        stubs: [],
      });
    });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('computed properties', () => {
    // let wrapper;
    // beforeEach(() => {
      // wrapper = createTestSubject(new Date(2019, 7, 22, 15, 45));
    // });
    describe('hourInput', () => {
      describe('getter', () => {
        xit('calls zeroPad function', () => {
          expect(zeroPad).toHaveBeenCalledWith(15);
        });
      });
      describe('setter', () => {
        it('calls parseAndClipNumber function', () => {
          wrapper.vm.hourInput = 4;
          expect(parseAndClipNumber).toHaveBeenCalledWith(4, 0, 23);
        });
      });
    });
    describe('minuteInput', () => {
      describe('getter', () => {
        xit('calls zeroPad function', () => {
          expect(zeroPad).toHaveBeenCalledWith(45);
        });
      });
      describe('setter', () => {
        it('calls parseAndClipNumber function', () => {
          wrapper.vm.minuteInput = 89;
          expect(parseAndClipNumber).toHaveBeenCalledWith(89, 0, 59);
        });
      });
    });
    describe('dateConstructor', () => {
      describe('and `hours` and `minutes` fields are set', () => {
        xit('returns an array of Date constructor arguments', () => {
          expect(wrapper.vm.dateConstructor).toHaveLength(5);
          expect(wrapper.vm.dateConstructor).toEqual([0, 0, 0, 15, 45]);
        });
      });
      describe('given at least one field is null', () => {
        const nullValueCombinations = [
          ['`hour` is null',                      { hour: null, minute: 4 }],
          ['`minute` is null',                    { hour: 23, minute: null }],
          ['`hour` and `minute` are null',        { hour: null, minute: null }],
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
            wrapper.setData({ hour: null });
            expect(wrapper.vm.date).toBe(null);
          });
        });
        describe('given a date is set (`dateConstructor` returns constructor args)', () => {
          it('returns a Date object', () => {
            expect(wrapper.vm.date).toBeInstanceOf(Date);
          });
          it('is created as a UTC Date', () => {
            wrapper.setData({ hour: 1, minute: 16 });
            const args = wrapper.vm.dateConstructor;
            const utcTime = Date.UTC(...args);
            expect(wrapper.vm.date.getTime()).toEqual(utcTime);
          });
        });
        describe('return value', () => {
          it('returns date if dateConstructor is not null', () => {
            wrapper.setData({ hour: 1, minute: 16 });
            expect(wrapper.vm.date instanceof Date).toBe(true);
          });
        });
      });
      describe('setter', () => {
        describe('given a non-Date value', () => {
          it('does nothing', () => {
            wrapper.setData({ hour: 17, minute: 5 });
            wrapper.vm.date = null;
            expect(wrapper.vm.hour).toBe(17);
            expect(wrapper.vm.minute).toBe(5);
          });
        });
        describe('given a Date object', () => {
          beforeEach(() => {
            wrapper.vm.date = new Date(Date.UTC(2018, 1, 13, 2, 19));
          });
          it("sets `hour` to the Date object's hour", () => {
            expect(wrapper.vm.hour).toBe(2);
          });
          it("sets `minute` to the Date object's minute", () => {
            expect(wrapper.vm.minute).toBe(19);
          });
        });
      });
    });
  });

  describe('`v-model` interface', () => {
    describe('when the `value` property changes', () => {
      let realDateSetter;
      let mockDateSetter;
      beforeEach(() => {
        // Mock the date setter
        realDateSetter = TimeInput.computed.date.set;
        mockDateSetter = jest.fn();
        TimeInput.computed.date.set = mockDateSetter;
      });
      afterEach(() => {
        TimeInput.computed.date.set = realDateSetter;
      });
      describe('given the new `value` is different from the current `date`', () => {
        xit('sets `date` to equal the new `value`', () => {
          const firstDate = new Date('1960-01-01T19:20+01:00');
          const secondDate = new Date('1975-04-19T19:12+08:00');
          wrapper.setProps({ value: firstDate });
          wrapper.setProps({ value: secondDate });
          expect(mockDateSetter).toHaveBeenCalledTimes(2);
          expect(mockDateSetter).toHaveBeenNthCalledWith(1, firstDate);
          expect(mockDateSetter).toHaveBeenNthCalledWith(2, secondDate);
        });
      });
      describe('given the new `value` is the same as the current `date`', () => {
        xit('avoids an infinite feedback loop by doing nothing (does not set `date`)', () => {
          // Two equal dates as different objects
          const firstDate = new Date('1960-01-01T19:20+01:00');
          const secondDate = new Date('1960-01-01T19:20+01:00');
          const wrapper = createTestSubject(firstDate);
          wrapper.setProps({ value: secondDate });
          expect(mockDateSetter).toHaveBeenCalledTimes(1);
          expect(mockDateSetter.mock.calls[0][0]).toBe(firstDate);
          expect(mockDateSetter.mock.calls[0][0]).not.toBe(secondDate);
        });
      });
    });
    describe('when the internal `date` Date object changes', () => {
      xit('emits an `input` event', () => {
        const wrapper = createTestSubject(new Date());
        const newDate = new Date('1978-01-01T19:20+01:00');
        wrapper.vm.date = newDate;
        const emitted = wrapper.emitted().input;
        expect(emitted.length).toBeGreaterThan(0);
        expect(emitted).toContainEqual([new Date('1899-12-31T19:20+01:00')]);
      });
    });
  });

  describe('#created lifecycle hook', () => {
    it('sets `date` to equal the `value` property', () => {
      const value = new Date('1978-01-01T19:20+01:00');
      wrapper.setProps({ value: value });
      expect(wrapper.vm.date.getHours()).toEqual(value.getHours());
      expect(wrapper.vm.date.getMinutes()).toEqual(value.getMinutes());
    });
  });

  describe('properties', () => {
      describe('legend attribute', () => {
        it('is set when label is passed', () => {
          const label = 'Launch date and time';
          wrapper.setProps({ label });
          expect(wrapper.find('legend').text()).toBe(label);
        });
        it('is not set if label is not passed', () => {
          expect(wrapper.find('.govuk-fieldset__legend').exists()).toBe(false);
        });
      });
      describe('hint', () => {
        it('is displayed when provided', () => {
          const hint = 'For example, 31 05 2020 at 09:00';
          wrapper.setProps({ hint, id: 'testid' });
          expect(wrapper.find('#testid-hint').text()).toBe(hint);
        });
        it('does not display when not provided', () => {
          wrapper.setProps({ id: 'testid' });
          expect(wrapper.find('#testid-hint').exists()).toBe(false);
        });
         it('sets aria-described by with the value of hint id', () => {
          const hint = 'For example, 31 05 2020 at 09:00';
          wrapper.setProps({ hint, id: 'testid' });
          expect(wrapper.find('.govuk-fieldset').attributes('aria-describedby')).toBe('testid-hint');
        });
        it('undefined when no hint provided', () => {
          expect(wrapper.find('.govuk-fieldset').attributes('aria-describedby')).toBe(undefined);
        });
      });
      describe('id', () => {
        it('assigns id to govuk-date-input', () => {
          expect(wrapper.find('.govuk-date-input').attributes().id).toBe('launch_time');
        });
        it('is used to create ids for inputs', () => {
          const id = 'launch_time_test';
          wrapper.setProps({ id });
          expect(wrapper.findAll('.govuk-date-input__input').at(0).attributes().id).toBe(`${id}-hour`);
          expect(wrapper.findAll('.govuk-date-input__input').at(1).attributes().id).toBe(`${id}-minute`);
        });
        it('is used to create "for" attributes for labels', () => {
          const id = 'launch_time';
          wrapper.setProps({ id });
          expect(wrapper.findAll('.govuk-date-input__label').at(0).attributes().for).toBe(`${id}-hour`);
          expect(wrapper.findAll('.govuk-date-input__label').at(1).attributes().for).toBe(`${id}-minute`);
        });
      });
    });  

  });
});
