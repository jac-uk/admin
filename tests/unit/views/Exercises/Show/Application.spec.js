import Application from '@/views/Exercises/Show/Application';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

const mockExercise = {
  exerciseRef: 'mock exercise',
  immediateStart: '56',
  applicationOpenDate: 'TestOpen',
  applicationCloseDate: 'TestClose',
};

const mockApplication = {
  referenceNumber: 'mock ref 1',
  status: 'mock status 1',
  personalDetails: {
    name: 'mock name 1',
    email: 'mock@email.one',
    phone: '0987654321',
    dateOfBirth: '',
  },
  equalityAndDiversitySurvey: {
    gender: 'female',
    disability: false,
    ethnicGroup: 'white-black-african',
    currentLegalRole: [
      'barrister',
      'other-current-legal-role',
    ],
    otherCurrentLegalRoleDetails: 'mock role details',
  },
  firstAssessorFullName: 'mock assessor 1 name',
  firstAssessorEmail: 'mock assessor 1 email',
  firstAssessorPhone: 'mock assessor 1 phone',
  SecondAssessorName: 'mock assessor 2 name',
  SecondAssessorEmail: 'mock@email.two',
  SecondAssessorPhone: '0123456789',
};

const mockStore = {
  dispatch: jest.fn(),
  state: {
    exerciseDocument: {
      record: mockExercise,
    },
    application: {
      record: mockApplication,
    },
  },
};

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
  return shallowMount(Application, {
    localVue,
    mocks: {
      $route: mockRoute,
      $router: mockRouter,
      $store: mockStore,
    },
    stubs: {
      RouterView: true,
      RouterLink: true,
    },
    propsData: mockProps,
  });
};

describe('@/views/Exercises/Show/Application', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders the component', () => {
      expect(wrapper.find('h1').exists()).toBe(true);
    });

    it('displays application reference in header', () => {
      expect(wrapper.find('h1').text()).toEqual(expect.stringContaining(mockApplication.referenceNumber));
    });

    it('has unlock button if application completed', () => {
      const mockApp = {
        ...mockApplication,
        status: 'applied',
      };
      wrapper.vm.$store.state.application.record = mockApp;
      const buttons = wrapper.findAll('.jac-button-group span button');
      expect(buttons.length).toEqual(1);
      expect(buttons.wrappers[0].text()).toEqual(expect.stringContaining('Unlock'));
    });

    it('has "mark as applied" if draft', () => {
      const mockApp = {
        ...mockApplication,
        status: 'draft',
      };
      wrapper.vm.$store.state.application.record = mockApp;
      const buttons = wrapper.findAll('.jac-button-group span button');
      expect(buttons.length).toEqual(1);
      expect(buttons.wrappers[0].text()).toEqual(expect.stringContaining('Mark as applied'));
    });
  });

  describe('methods', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
      wrapper.vm.$store.dispatch = jest.fn();
    });

    describe('unlock()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.unlock).toBe('function');
      });
      it('dispatches unlock', () => {
        wrapper.vm.unlock();
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('application/unlock');
      });
    });

    describe('submitApplication()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.submitApplication).toBe('function');
      });
      it('dispatches submit', () => {
        wrapper.vm.submitApplication();
        expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('application/submit');
      });
    });
  });
});
