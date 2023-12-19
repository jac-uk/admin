import Downloads from '@/views/Exercise/Details/Downloads/Edit';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import { vi, describe, beforeEach, it } from 'vitest';

/**
* @vitest-environment jsdom
*/

const mockExercise = {
  id: 'mock exercise id',
  exerciseRef: 'mock exercise',
  progress: {

  },
};

const mockIsApproved = vi.fn().mockName('exerciseDocument/isApproved');
const mockData = vi.fn().mockName('exerciseDocument/data').mockReturnValue(mockExercise);

const mockRoute = {
  name: 'name-of-current-route',
  params: {
    id: 'abc123',
  },
};

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
};

const mockProps = {
  exercise: {
    id: 'mockid',
  },
  status: 'mockstatus',
};

const mockSave = vi.fn().mockName('exerciseDocument/save');

const store = createStore({
  modules: {
    exerciseDocument: {
      namespaced: true,
      state: {
        record: mockExercise,
      },
      getters: {
        id: vi.fn().mockReturnValue(mockExercise.id),
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
        nextPage: () => vi.fn(),
      },
    },
  },
});

const createTestSubject = shallowMount(Downloads, {
  global: {
    plugins: [store],
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
  },
});

describe.skip('@/views/Exercise/Show/Downloads', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe.skip('form', () => {
      it('contains a form', () => {
        expect(wrapper.find('form').exists()).toBe(true);
      });

      it('calls save() on submit', () => {
        wrapper.vm.save = vi.fn();

        wrapper.find('form').trigger('submit');

        expect(wrapper.vm.save).toHaveBeenCalled();
      });
    });

    it.skip('contains 7 multi uploads', () => {
      expect(wrapper.findAll(RepeatableFields)).toHaveLength(7);
    });
  });

  describe('computed properties', () => {
    describe('uploadPath', () => {
      it('returns upload path including exercise id', () => {
        mockData.mockReturnValue(mockExercise);
        const wrapper = createTestSubject();
        expect(wrapper.vm.uploadPath).toEqual(`/exercise/${mockExercise.id}`);
      });
    });
  });

  describe('methods', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
      wrapper.vm.validate = vi.fn();
      wrapper.vm.isValid = vi.fn();
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
