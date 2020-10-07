import DryRun from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/DryRun.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

const mockTestQuestions = {
  introduction: 'Hello',
  questions: [
    {
      type: 'critical-analysis',
      details: 'I am the first question',
        options: [
        'I am the first option',
        'I am the second option',
        'I am the third option',
        'I am the fourth option',
      ],
      'correct': 0,
    },
  ],
};

const mockQualifyingTest = {
  title: 'mockQtTitle',
  id: '1111',
  mode: 'mode',
  type: 'critical-analysis',
  status: 'started',
  startDate: new Date('111'),
  endDate: new Date('222'),
  testDuration: 222,
  additionalInstructions: [
    {
      text: 'one',
    },
    {
      text: 'two',
    },
  ],
  testQuestions: mockTestQuestions,
  invitedEmails: null,
};

describe('DryRun.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createTestSubject(DryRun, {
      propsData: {},
      mocks: {},
      stubs: [],
    });
    wrapper.vm.$store.state.qualifyingTest.record = mockQualifyingTest;
  });

  describe('template', () => {
    it('renders successfully', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('contains a <h2>', () => {
      expect(wrapper.contains('h2')).toBe(true);
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
  });

  describe('methods', () => {
    describe('formatEmails', () => {

      beforeEach(() => {
        wrapper.vm.$store.dispatch.mockClear();
      });

      it('removes duplicates', () => {
          wrapper.setData({
            invitedEmailsText: 'user123@test.com\nuser987@test.com\nuser987@test.com',
          });
        expect(wrapper.vm.$data.invitedEmailsText).toBe('user123@test.com\nuser987@test.com\nuser987@test.com');
        wrapper.vm.formatEmails();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.qualifyingTest.invitedEmails).toStrictEqual(['user123@test.com','user987@test.com']);
      });

      it('trims white space', () => {
        wrapper.setData({
          invitedEmailsText: 'user123@test.com\n  user456@test.com \n user678@test.com ',
        });
        expect(wrapper.vm.$data.invitedEmailsText).toBe('user123@test.com\n  user456@test.com \n user678@test.com ');
        wrapper.vm.formatEmails();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.qualifyingTest.invitedEmails).toStrictEqual(['user123@test.com', 'user456@test.com', 'user678@test.com']);
      });

      it('converts to lower case', () => {
        wrapper.setData({
          invitedEmailsText: 'USER123@test.com\nUSER456@test.com\nUSER678@test.com',
        });
        expect(wrapper.vm.$data.invitedEmailsText).toBe('USER123@test.com\nUSER456@test.com\nUSER678@test.com');
        wrapper.vm.formatEmails();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.qualifyingTest.invitedEmails).toStrictEqual(['user123@test.com', 'user456@test.com', 'user678@test.com']);
      });

      it('formats emails correctly', () => {
        wrapper.setData({
          invitedEmailsText: 'user123@test.com\nUSER234@test.com\n user7564@test.com \nuser7564@test.com',
        });
        expect(wrapper.vm.$data.invitedEmailsText).toBe('user123@test.com\nUSER234@test.com\n user7564@test.com \nuser7564@test.com');
        wrapper.vm.formatEmails();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.qualifyingTest.invitedEmails).toStrictEqual(['user123@test.com','user234@test.com','user7564@test.com']);
      });

    });

    describe('save', () => {

      beforeEach(() => {
        wrapper.vm.$store.dispatch.mockClear();
        wrapper.setData({
          invitedEmailsText: 'test123@test.com\ntest234@test.com\nuser7564@test.com\nuser7564@test.com',
        });
        wrapper.vm.save();
      });

      it('dispatches `qualifyingTest/save` Vuex action', () => {
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledTimes(1);
        const dispatchedAction = wrapper.vm.$store.dispatch.mock.calls[0][0];
        expect(dispatchedAction).toBe('qualifyingTest/save');
      });

      it('with the expected save payload', () => {
        const dispatchedPayload = wrapper.vm.$store.dispatch.mock.calls[0][1].invitedEmails;
        expect(dispatchedPayload).toEqual(expect.objectContaining(['test123@test.com','test234@test.com','user7564@test.com']));
      });

      it('navigates to the QT dry run set up page', () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ 'name': 'qualifying-test-review' });
      });
    });
  });
});

