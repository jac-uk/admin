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

  it('renders successfully', () => {
      expect(wrapper.exists()).toBe(true);
    });

  it.only('formats emails', () => {
    // expect([EMAIL DATA]).toBe(EMPTY);

    // Set email data
    wrapper.setData({
      invitedEmailsText: 'one,\none,\none',
    });

    // expect([EMAIL DATA]).toBe(WHAT WE SET IT AS);

    //call the function which you created 
    wrapper.vm.formatEmails();
    // change line below to be the assertion 
    console.log(wrapper.vm.qualifyingTest.invitedEmails);
    expect(wrapper.exists()).toBe(true);
    // expect(wrapper.vm.qualifyingTest.invitedEmails).toBe('????')
  });
});

