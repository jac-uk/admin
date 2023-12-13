import Eligibility from '@/views/Exercise/Details/Eligibility/View.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import { describe, it } from 'vitest';

const exercise = {
  postQualificationExperience: 'other',
  otherYears: '9 years',
  schedule2DApply: true,
  qualifications: [
    'Advocate',
    'Solicitor',
  ],
  aSCApply: false,
  reasonableLengthService: 'other',
  otherLOS: '1 year',
  retirementAge: 'other',
  otherRetirement: '65 years',
};

const store = createStore({
  modules: {
    exerciseDocument: {
      namespaced: true,
      state: {
        record: exercise,
      },
      getters: {
        data: () => () => exercise,
      },
    },
  },
});

const createTestSubject = () => {
  return shallowMount(Eligibility, {
    global: {
      plugins: [store],
      stubs: {
        'RouterLink': true,
      },
    },
  });
};

describe.skip('@/views/Exercise/Show/Eligibility', () => {
  describe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('dl').exists()).toBe(true);
    });

    it('renders the router-link', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('RouterLink-stub').exists()).toBe(true);
    });
  });

  describe('computed properties', () => {
    describe('exercise', () => {
      it('returns record object from state', () => {
        const wrapper = createTestSubject();
        expect(wrapper.vm.exercise).toEqual(exercise);
      });
    });
  });
});
