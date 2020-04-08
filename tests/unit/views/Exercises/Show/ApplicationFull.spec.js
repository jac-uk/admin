import ApplicationFull from '@/views/Exercises/Show/ApplicationFull';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

localVue.filter('lookup', jest.fn());
localVue.filter('toYesNo', jest.fn());
localVue.filter('formatNIN', jest.fn());
localVue.filter('formatDate', jest.fn());

const mockExercise = {
  exerciseRef: 'mock exercise',
  immediateStart: '56',
  applicationOpenDate: 'TestOpen',
  applicationCloseDate: 'TestClose',
  typeOfExercise: 'legal',
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
  characterInformation: {

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
  qualifications: [
    {
      date: new Date(),
      location: 'england-wales',
      type: 'barrister',
    },
  ],
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
  return shallowMount(ApplicationFull, {
    //store,
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

describe('@/views/Exercises/Show/ApplicationFull', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject();
    });

    it('renders the component', () => {
      expect(wrapper.find('.govuk-grid-row').exists()).toBe(true);
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

    it('renders identifying sections in full view', () => {
      wrapper.setProps({
        streamlined: false,
      });

      const headers = wrapper.findAll('.govuk-grid-column-full > div > div > h2');

      expect(headers.length).toBeGreaterThan(1);
      expect(headers.at(0).text()).toEqual(expect.stringContaining('Personal details'));
      expect(headers.at(1).text()).toEqual(expect.stringContaining('Character information'));
      expect(headers.at(2).text()).toEqual(expect.stringContaining('Equality and diversity information'));
    });

    it('doesn\'t render identifying sections in panel pack view', () => {
      wrapper.setProps({
        streamlined: true,
      });

      const headers = wrapper.findAll('.govuk-grid-column-full > div > div > h2');

      expect(headers.length).toBeGreaterThan(1);

      expect(headers.at(0).text()).not.toEqual(expect.stringContaining('Personal details'));
      expect(headers.at(1).text()).not.toEqual(expect.stringContaining('Character information'));
      expect(headers.at(2).text()).not.toEqual(expect.stringContaining('Equality and diversity information'));
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
