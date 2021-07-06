import Downloads from '@/views/Exercise/Details/Downloads/View';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockExercise = {
  exerciseRef: 'mock exercise',
};

const mockIsApproved = jest.fn();
const mockData = jest.fn().mockReturnValue(mockExercise);

const mockRoute = {
  name: 'name-of-current-route',
  params: {
    id: 'abc123',
  },
};

const mockRouter = {
  replace: jest.fn(),
};

const mockProps = {
  exercise: {
    id: 'mockid',
  },
  status: 'mockstatus',
};

const createTestSubject = () => {
  const store = new Vuex.Store({
    modules: {
      exerciseDocument: {
        namespaced: true,
        state: {
          record: mockExercise,
        },
        getters: {
          id: jest.fn(),
          data: () => mockData,
          isEditable: mockIsApproved,
          hasIndependentAssessments: () => true,
        },
      },
    },
  });

  return shallowMount(Downloads, {
    store,
    localVue,
    mocks: {
      $route: mockRoute,
      $router: mockRouter,
    },
    stubs: {
      'RouterLink': true,
    },
    propsData: mockProps,
  });
};

xdescribe('@/views/Exercise/Show/Downloads', () => {
  describe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();

      expect(wrapper.exists()).toBe(true);
    });

    it('without downloads renders a message', () => {
      const wrapper = createTestSubject();

      const message = wrapper.find('p');
      expect(message.exists()).toBeTrue();
      expect(message.text()).toEqual(expect.stringContaining('No files uploaded'));
    });

    describe('with downloads', () => {
      const exercise = {
        downloads: {
          jobDescriptions: [],
          termsAndConditions: [],
          independentAssessors: [],
          candidateAssessementForms: [],
          pensionsInformation: [],
          competencyFramework: [],
          welshTranslation: [],
          skillsAndAbilitiesCriteria: [],
        },
      };

      it('doesn\'t render message', () => {
        mockData.mockReturnValue(exercise);
        const wrapper = createTestSubject();
        const message = wrapper.find('p');
        expect(message.exists()).toBeFalse();
      });

      it('renders lists of uploaded files', () => {
        mockData.mockReturnValue(exercise);
        const wrapper = createTestSubject();
        const lists = wrapper.findAll('dt');

        expect(lists.length).toEqual(Object.keys(exercise.downloads).length);
      });

      it('renders message for each item with no downloads available', () => {
        mockData.mockReturnValue(exercise);
        const wrapper = createTestSubject();
        const lists = wrapper.findAll('dd > span');
        expect(lists.length).toEqual(Object.keys(exercise.downloads).length);
      });

      it('renders download links for every non-empty list', () => {
        mockData.mockReturnValue({
          downloads: {
            ...exercise.downloads,
            jobDescriptions: [
              {
                file: 'mock file',
                title: 'mock title',
              },
            ],
          },
        });
        const wrapper = createTestSubject();
        const lists = wrapper.findAll('dd > ul');

        expect(lists.length).toEqual(Object.keys(exercise.downloads).length);
        expect(lists.at(0).findAll(DownloadLink).length).toEqual(1);
      });
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        mockData.mockReturnValue(mockExercise);
        const wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(mockExercise);
      });
    });
  });
});
