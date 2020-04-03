import Downloads from '@/views/Exercises/Show/Downloads';
import DownloadLink from '@/components/DownloadLink';
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

describe('@/views/Exercises/Show/Downloads', () => {
  describe('template', () => {
    it('renders the component', () => {
      let wrapper = createTestSubject();

      expect(wrapper.exists()).toBe(true);
    });

    it('without downloads renders a message', () => {
      let wrapper = createTestSubject();

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
        },
      };

      it('doesn\'t render message', () => {
        mockData.mockReturnValue(exercise);
        let wrapper = createTestSubject();
        const message = wrapper.find('p');
        expect(message.exists()).toBeFalse();
      });

      it('renders lists of uploaded files', () => {
        mockData.mockReturnValue(exercise);
        let wrapper = createTestSubject();
        const lists = wrapper.findAll('dt');

        expect(lists.length).toEqual(4);
      });

      it('renders message if list is empty', () => {
        mockData.mockReturnValue(exercise);
        let wrapper = createTestSubject();
        const lists = wrapper.findAll('dd > span');

        expect(lists.length).toEqual(4);
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
        let wrapper = createTestSubject();
        const lists = wrapper.findAll('dd > ul');

        expect(lists.length).toEqual(4);
        expect(lists.at(0).findAll(DownloadLink).length).toEqual(1);
      });
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        mockData.mockReturnValue(mockExercise);
        let wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(mockExercise);
      });
    });
  });
});
