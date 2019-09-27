import ExerciseEditTimeline from '@/views/Exercises/Edit/Timeline';
import { shallowMount } from '@vue/test-utils';

const exercise = {
  applicationOpenDate: new Date(2019, 1, 1),
  applicationCloseDate: new Date(2019, 3, 3),
  shortlistingMethods: [],
};

const mockStore = {
  dispatch: jest.fn(),
  state: {
    exerciseDocument: {
      record: {},
    },
  },
  getters: {
    'exerciseCreateJourney/nextPage': { name: 'mock-next-page' },
    'exerciseDocument/data': () => exercise,
  },
};

const mockRouter = {
  push: jest.fn(),
};

describe('views/Exercises/Edit/Timeline', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExerciseEditTimeline, {
      mocks: {
        $store: mockStore,
        $router: mockRouter,
      },
    });
  });

  describe('template', () => {
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('contains a <h1>', () => {
      expect(wrapper.contains('h1')).toBe(true);
    });

    it('contains a <form>', () => {
      expect(wrapper.find('form').exists()).toBe(true);
    });

    it('the <form> calls the `save` method when submitted', () => {
      const mockSave = jest.fn();
      wrapper.setMethods({ save: mockSave });
      wrapper.find('form').trigger('submit');
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('the <form> contains a "Save and continue" submit button', () => {
      const button = wrapper.find('form button');
      expect(button.element.type).toBe('submit');
      expect(button.text()).toBe('Save and continue');
    });
  });

  describe('methods', () => {
    describe('save', () => {
      const exerciseData = {
        applicationOpenDate: new Date(2019, 10, 21),
        scenarioTestStartTime: new Date(0, 0, 0, 6, 35),
      };

      beforeEach(() => {
        mockStore.dispatch.mockClear();
        wrapper.setData({
          exercise: exerciseData,
        });
        wrapper.vm.save();
      });

      it('dispatches `exerciseDocument/save` Vuex action', () => {
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
        const dispatchedAction = mockStore.dispatch.mock.calls[0][0];
        expect(dispatchedAction).toBe('exerciseDocument/save');
      });

      it('with the expected save payload', () => {
        const dispatchedPayload = mockStore.dispatch.mock.calls[0][1];
        expect(dispatchedPayload).toEqual(expect.objectContaining(exerciseData));
      });

      it('navigates to the next page of the create journey', () => {
        expect(mockRouter.push).toHaveBeenCalledWith(mockStore.getters['exerciseCreateJourney/nextPage']);
      });
    });
  });

  describe('computed properties', () => {
    describe('scenarioQT', () => {
      describe('when scenarioQT is on the list of selected shortlisting methods', () => {
        it('displays the block with scenarioQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['some method', 'Scenario test qualifying test (QT)', 'other'] });
          expect(wrapper.find({ ref: 'scenarioQT' }).exists()).toBe(true);
        });
      });

      describe('when scenarioQT is not on the list of selected shortlisting methods', () => {
        it('does not display the block with scenarioQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['some method', 'Situational judgement qualifying test (QT)', 'other'] });
          expect(wrapper.find({ ref: 'scenarioQT' }).exists()).toBe(false);
        });
      });
    });

    describe('situationalJudgementOrCriticalAnalysisQT', () => {
      describe('when Situational Judgement QT is on the list of selected shortlisting methods', () => {
        it('displays the block with situationalJudgementOrCriticalAnalysisQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['some method', 'Situational judgement qualifying test (QT)', 'other'] });
          expect(wrapper.find({ ref: 'situationalJudgementOrCriticalAnalysisQT' }).exists()).toBe(true);
        });
      });

      describe('when Critical Analysis QT is on the list of selected shortlisting methods', () => {
        it('displays the block with situationalJudgementOrCriticalAnalysisQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['some method', 'other method', 'Critical analysis qualifying test (QT)'] });
          expect(wrapper.find({ ref: 'situationalJudgementOrCriticalAnalysisQT' }).exists()).toBe(true);
        });
      });

      describe('when both Situational Judgement QT and Critical Analysis QT is on the list of selected shortlisting methods', () => {
        it('displays the block with situationalJudgementOrCriticalAnalysisQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['Situational judgement qualifying test (QT)', 'some method', 'other method', 'Critical analysis qualifying test (QT)'] });
          expect(wrapper.find({ ref: 'situationalJudgementOrCriticalAnalysisQT' }).exists()).toBe(true);
        });
      });

      describe('when Situational Judgement QT and Critical Analysis QT are not on the list of selected shortlisting methods', () => {
        it('does not display the block with situationalJudgementOrCriticalAnalysisQT dates', () => {
          wrapper.setData({ exerciseShortlistingMethods: ['some method', 'other method'] });
          expect(wrapper.find({ ref: 'situationalJudgementOrCriticalAnalysisQT' }).exists()).toBe(false);
        });
      });
    });
  });
});
