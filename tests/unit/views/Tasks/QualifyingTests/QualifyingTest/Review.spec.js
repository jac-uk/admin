import Review from '@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Review.vue';
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
};

describe('@/views/Exercises/Tasks/QualifyingTests/QualifyingTest/Review', () => { 
  
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
    });
      
    describe('template', () => {
      it('renders the component', () => {
        console.log(wrapper.html());
        expect(wrapper.exists()).toBe(true);
      });
    });

  });

});

