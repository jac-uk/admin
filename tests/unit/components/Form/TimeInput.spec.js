import { shallowMount } from '@vue/test-utils';
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
  const createTestSubject = (value) => {
    return shallowMount(TimeInput, {
      propsData: {
        value,
        id: 'launch_time',
      },
    });
  };

  describe('properties', () => {
    let subject;

    beforeEach(() => {
      subject = createTestSubject(new Date(1988, 9, 3, 15, 15));
    });

    describe('label', () => {
      it('sets legend', () => {
        const label = 'Launch date and time';
        subject.setProps({ label });
        expect(subject.find('.govuk-fieldset__legend').text()).toBe(label);
      });

      it('does not set legend if label is not passed', () => {
        expect(subject.find('.govuk-fieldset__legend').exists()).toBe(false);
      });
    });

    describe('hint', () => {
      it('displays span hint if provided and sets text', () => {
        const hint = 'For example, 31 05 2020 at 09:00';
        subject.setProps({ hint, id: 'testid' });
        expect(subject.find('#testid-hint').exists()).toBe(true);
        expect(subject.find('#testid-hint').text()).toBe(hint);
      });

       it('sets aria-describedby with the value of hint id', () => {
        const hint = 'For example, 31 05 2020 at 09:00';
        subject.setProps({ hint, id: 'testid' });
        expect(subject.find('.govuk-fieldset').attributes('aria-describedby')).toBe('testid-hint');
      });

      it('does not display hint if not not provided', () => {
        subject.setProps({ id: 'testid' });
        expect(subject.find('#testid-hint').exists()).toBe(false);
      });
    });

    describe('id', () => {
      it('assigns id to govuk-date-input', () => {
        expect(subject.find('.govuk-date-input').attributes().id).toBe('launch_time');
      });

      it('is used to create ids for inputs', () => {
        const id = 'launch_time_test';
        subject.setProps({ id });
        expect(subject.findAll('.govuk-date-input__input').at(0).attributes().id).toBe(`${id}-hour`);
        expect(subject.findAll('.govuk-date-input__input').at(1).attributes().id).toBe(`${id}-minute`);
      });

      it('is used to create "for" attributes for labels', () => {
        const id = 'launch_time';
        subject.setProps({ id });
        expect(subject.findAll('.govuk-date-input__label').at(0).attributes().for).toBe(`${id}-hour`);
        expect(subject.findAll('.govuk-date-input__label').at(1).attributes().for).toBe(`${id}-minute`);
      });
    });
  });

  describe('computed properties', () => {
    let subject;
    beforeEach(() => {
      subject = createTestSubject(new Date(2019, 7, 22, 15, 45));
    });

    describe('hourInput', () => {
      describe('getter', () => {
        it('calls zeroPad function', () => {
          expect(zeroPad).toHaveBeenCalledWith(15);
        });
      });

      describe('setter', () => {
        it('calls parseAndClipNumber function', () => {
          subject.vm.hourInput = 4;
          expect(parseAndClipNumber).toHaveBeenCalledWith(4, 0, 23);
        });
      });
    });

    describe('minuteInput', () => {
      describe('getter', () => {
        it('calls zeroPad function', () => {
          expect(zeroPad).toHaveBeenCalledWith(45);
        });
      });


      describe('setter', () => {
        it('calls parseAndClipNumber function', () => {
          subject.vm.minuteInput = 89;
          expect(parseAndClipNumber).toHaveBeenCalledWith(89, 0, 59);
        });
      });
    });

    describe('dateConstructor', () => {
      describe('and `hours` and `minutes` fields are set', () => {
        it('returns an array of Date constructor arguments', () => {
          expect(subject.vm.dateConstructor).toHaveLength(5);
          expect(subject.vm.dateConstructor).toEqual([0, 0, 0, 15, 45]);
        });
      });

      describe('given at least one field is null', () => {
        const nullValueCombinations = [
          ['`hour` is null',                      { hour: null, minute: 4 }],
          ['`minute` is null',                    { hour: 23, minute: null }],
          ['`hour` and `minute` are null',        { hour: null, minute: null }],
        ];

        it.each(nullValueCombinations)('returns null (%s)', (label, data) => {
          subject.setData(data);
          expect(subject.vm.dateConstructor).toBe(null);
        });
      });
    });

    describe('date', () => {
      describe('getter', () => {
        describe('given the date is not set (`dateConstructor` returns null)', () => {
          it('returns null', () => {
            subject.setData({ hour: null });
            expect(subject.vm.date).toBe(null);
          });
        });

        describe('given a date is set (`dateConstructor` returns constructor args)', () => {
          it('returns a Date object', () => {
            expect(subject.vm.date).toBeInstanceOf(Date);
          });

          it('is created as a UTC Date', () => {
            subject.setData({ hour: 1, minute: 16 });
            const args = subject.vm.dateConstructor;
            const utcTime = Date.UTC(...args);

            expect(subject.vm.date.getTime()).toEqual(utcTime);
          });
        });

        describe('return value', () => {
          it('returns date if dateConstructor is not null', () => {
            subject.setData({ hour: 1, minute: 16 });
            expect(subject.vm.date instanceof Date).toBe(true);
          });
        });
      });

      describe('setter', () => {
        describe('given a non-Date value', () => {
          it('does nothing', () => {
            subject.setData({ hour: 17, minute: 5 });
            subject.vm.date = null;
            expect(subject.vm.hour).toBe(17);
            expect(subject.vm.minute).toBe(5);
          });
        });

        describe('given a Date object', () => {
          beforeEach(() => {
            subject.vm.date = new Date(Date.UTC(2018, 1, 13, 2, 19));
          });

          it("sets `hour` to the Date object's hour", () => {
            expect(subject.vm.hour).toBe(2);
          });
          it("sets `minute` to the Date object's minute", () => {
            expect(subject.vm.minute).toBe(19);
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
        it('sets `date` to equal the new `value`', () => {
          const firstDate = new Date('1960-01-01T19:20+01:00');
          const secondDate = new Date('1975-04-19T19:12+08:00');

          const subject = createTestSubject(firstDate);
          subject.setProps({ value: secondDate });

          expect(mockDateSetter).toHaveBeenCalledTimes(2);
          expect(mockDateSetter).toHaveBeenNthCalledWith(1, firstDate);
          expect(mockDateSetter).toHaveBeenNthCalledWith(2, secondDate);
        });
      });

      describe('given the new `value` is the same as the current `date`', () => {
        it('avoids an infinite feedback loop by doing nothing (does not set `date`)', () => {
          // Two equal dates as different objects
          const firstDate = new Date('1960-01-01T19:20+01:00');
          const secondDate = new Date('1960-01-01T19:20+01:00');

          const subject = createTestSubject(firstDate);
          subject.setProps({ value: secondDate });

          expect(mockDateSetter).toHaveBeenCalledTimes(1);
          expect(mockDateSetter.mock.calls[0][0]).toBe(firstDate);
          expect(mockDateSetter.mock.calls[0][0]).not.toBe(secondDate);
        });
      });
    });

    describe('when the internal `date` Date object changes', () => {
      it('emits an `input` event', () => {
        const subject = createTestSubject(new Date());
        const newDate = new Date('1978-01-01T19:20+01:00');
        subject.vm.date = newDate;

        const emitted = subject.emitted().input;

        expect(emitted.length).toBeGreaterThan(0);
        expect(emitted).toContainEqual([new Date('1899-12-31T19:20+01:00')]);
      });
    });
  });

  describe('#created lifecycle hook', () => {
    it('sets `date` to equal the `value` property', () => {
      const value = new Date('1978-01-01T19:20+01:00');
      const subject = createTestSubject(value);
      expect(subject.vm.date.getHours()).toEqual(value.getHours());
      expect(subject.vm.date.getMinutes()).toEqual(value.getMinutes());
    });
  });
});
