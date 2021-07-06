import Eligibility from '@/views/Exercise/Details/Eligibility/View';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

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

const store = new Vuex.Store({
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
    store,
    localVue,
    stubs: {
      'RouterLink': true,
    },
  });
};

xdescribe('@/views/Exercise/Show/Eligibility', () => {
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
