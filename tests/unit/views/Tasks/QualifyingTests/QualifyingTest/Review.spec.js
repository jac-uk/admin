import Review from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Review.vue';
import { createTestSubject } from '@/../tests/unit/helpers';

const mockCandidate = {
  fullName: 'Mock Name',
  email: 'mock@email.address',
  id: '00001',
  reasonableAdjustments: true,
  reasonableAdjustmentsDetails: 'abc',
};

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
  record: {
    id: '1111',
    title: 'mockQtTitle',
    startDate: new Date('111'),
    endDate: new Date('222'),
    additionalInstructions: [
      {
        text: 'one',
      },
      {
        text: 'two',
      },
    ],
    feedbackSurvey: 'URL/string',
    application: {
      id: 'asdfhkj1234',
      referenceNumber: 'JAC1234-qwe1234',
    },
    candidate: mockCandidate,
    mode: 'mode',
    type: 'critical-analysis',
    status: 'started',
    testDuration: 222,
    testQuestions: mockTestQuestions,
  },
};

const mockQualifyingTestResponses = {
  record: [
    {
      application: {
        id: 'testData-72',
        referenceNumber: 'testData-72',
      },
      candidate: mockCandidate,
      duration: {
        reasonableAdjustment: 0,
        testDuration: 60,
        testDurationAdjusted: 60,
      },
      lastUpdated: new Date('333'),
      qualifyingTest: {
        id: '1111',
        title: 'mockQtTitle',
        startDate: new Date('111'),
        endDate: new Date('222'),
        additionalInstructions: [
          {
            text: 'one',
          },
          {
            text: 'two',
          },
        ],
        feedbackSurvey: 'URL/string',
        application: {
          id: 'asdfhkj1234',
          referenceNumber: 'JAC1234-qwe1234',
        },
        mode: 'mode',
        type: 'critical-analysis',
        status: 'started',
        testDuration: 222,
      },
      responses: {

      },
      testQuestions: mockTestQuestions,
      vacancy: {
        id: 'wdpALbyICL7ZxxN5AQt8',
      },
    },
  ],
};

xdescribe('@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Review', () => { 
  
  describe('component instance', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = createTestSubject(Review, {
        mocks: {},
        stubs: [],
        propsData: {
        },
      });
      wrapper.vm.$store.state.qualifyingTest.record = mockQualifyingTest;
      wrapper.vm.$store.state.qualifyingTestResponses = mockQualifyingTestResponses;
      wrapper.vm.$store.state.candidate = mockQualifyingTestResponses.candidate;
    });
      
    describe('template', () => {
      it('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
      });
    });

  });

});

