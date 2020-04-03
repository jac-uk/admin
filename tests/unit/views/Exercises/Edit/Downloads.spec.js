import Downloads from '@/views/Exercises/Edit/Downloads';
import RepeatableFields from '@/components/RepeatableFields';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockExercise = {
  id: 'mock exercise id',
  exerciseRef: 'mock exercise',
  progress: {

  },
};

const mockIsApproved = jest.fn().mockName('exerciseDocument/isApproved');
const mockData = jest.fn().mockName('exerciseDocument/data').mockReturnValue(mockExercise);

const mockRoute = {
  name: 'name-of-current-route',
  params: {
    id: 'abc123',
  },
};

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

const mockProps = {
  exercise: {
    id: 'mockid',
  },
  status: 'mockstatus',
};

const mockSave = jest.fn().mockName('exerciseDocument/save');

const createTestSubject = () => {
  const store = new Vuex.Store({
    modules: {
      exerciseDocument: {
        namespaced: true,
        state: {
          record: mockExercise,
        },
        getters: {
          id: jest.fn().mockReturnValue(mockExercise.id),
          data: () => mockData,
          isEditable: mockIsApproved,
        },
        actions: {
          save: mockSave,
        },
      },
      exerciseCreateJourney: {
        namespaced: true,
        getters: {
          nextPage: () => jest.fn(),
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
      'BackLink': true,
      'RouterLink': true,
      'ErrorSummary': true,
    },
    propsData: mockProps,
  });
};

describe('@/views/Exercises/Show/Downloads', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('form', () => {
      it('contains a form', () => {
        expect(wrapper.find('form').exists()).toBe(true);
      });

      it('calls save() on submit', () => {
        wrapper.vm.save = jest.fn();

        wrapper.find('form').trigger('submit');

        expect(wrapper.vm.save).toHaveBeenCalled();
      });
    });

    it('contains 4 multi uploads', () => {
      expect(wrapper.findAll(RepeatableFields)).toHaveLength(4);
    });
  });

  describe('computed properties', () => {
    describe('uploadPath', () => {
      it('returns upload path including exercise id', () => {
        mockData.mockReturnValue(mockExercise);
        let wrapper = createTestSubject();
        expect(wrapper.vm.uploadPath).toEqual(`/exercise/${mockExercise.id}`);
      });
    });
  });

  describe('methods', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
      wrapper.vm.validate = jest.fn();
      wrapper.vm.isValid = jest.fn();
    });

    describe('save()', () => {
      it('is a function', () => {
        expect(wrapper.vm.save).toBeFunction();
      });

      it('calls validate()', async () => {
        await wrapper.vm.save();

        expect(wrapper.vm.validate).toHaveBeenCalled();
      });

      it('if not valid, does nothing', async () => {
        mockSave.mockClear();
        wrapper.vm.isValid.mockReturnValue(false);

        await wrapper.vm.save();

        expect(wrapper.vm.isValid).toHaveBeenCalled();
        expect(wrapper.vm.exercise.progress.downloads).toBeFalsy();
        expect(mockSave).not.toHaveBeenCalled();
      });

      describe('if valid', () => {
        it('updates progress', async () => {
          wrapper.vm.isValid.mockReturnValue(true);

          await wrapper.vm.save();

          expect(wrapper.vm.exercise.progress.downloads).toBeTrue();
        });

        it('saves the exercise and returns to preview page', async () => {
          wrapper.vm.isValid.mockReturnValue(true);

          await wrapper.vm.save();

          expect(mockSave).toHaveBeenCalledWith(expect.anything(), wrapper.vm.exercise);
          expect(mockRouter.push).toHaveBeenCalled();
        });
      });
    });
  });
});
