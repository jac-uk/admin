import Applications from '@/views/Exercise/Show/Applications';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

localVue.filter('lookup', jest.fn());
localVue.filter('showAlternative', jest.fn());

jest.mock('@jac-uk/jac-kit/helpers/export', () => {
  return {
    downloadXLSX: jest.fn(),
  };
});

const mockExercise = {
  referenceNumber: 'mock exercise',
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
    professionalBackground: [
      'solicitor',
      'other-professional-background',
    ],
    heldFeePaidJudicialRole: 'fee-paid-tribunal-post',
    otherProfessionalBackgroundDetails: 'mock background details',
  },
  firstAssessorFullName: 'mock assessor 1 name',
  firstAssessorEmail: 'mock assessor 1 email',
  firstAssessorPhone: 'mock assessor 1 phone',
  SecondAssessorName: 'mock assessor 2 name',
  SecondAssessorEmail: 'mock@email.two',
  SecondAssessorPhone: '0123456789',
};

const mockApplications = [
  {
    referenceNumber: '12345',
    ...mockApplication,
  },
  {
    referenceNumber: '23456',
    ...mockApplication,
  },
];

const store = new Vuex.Store({
  modules: {
    exerciseDocument: {
      namespaced: true,
      state: {
        record: mockExercise,
      },
      getters: {
        data: () => () => mockExercise,
      },
    },
    applications: {
      namespaced: true,
      state: {
        records: mockApplications,
      },
      getters: {
        data: () => () => mockApplications,
      },
      actions: {
        bind: jest.fn(),
      },
    },
  },
});

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
  return shallowMount(Applications, {
    store,
    localVue,
    mocks: {
      $route: mockRoute,
      $router: mockRouter,
    },
    stubs: {
      RouterView: true,
      RouterLink: true,
    },
    propsData: mockProps,
  });
};

describe('@/views/Exercise/Show/Applications', () => {
  describe('template', () => {
    it('renders the component', () => {
      const wrapper = createTestSubject();
      expect(wrapper.find('div').exists()).toBe(true);
    });
  });

  describe('methods', () => {
    let wrapper;
    beforeEach(() => {
       wrapper = createTestSubject();
    });

    describe('exportContacts()', () => {

      it('is a function', () => {
        expect(typeof wrapper.vm.exportContacts).toBe('function');
      });

      it('calls gatherReportData', async () => {
        wrapper.vm.gatherReportData = jest.fn();
        await wrapper.vm.gatherReportData();
        expect(wrapper.vm.gatherReportData).toHaveBeenCalled();
      });

      it('calls downloadXLSX', async () => {
        const mockReport = 'mock report';
        const mockTitle = 'Contacts';

        wrapper.vm.gatherReportData = jest.fn().mockReturnValue(mockReport);

        await wrapper.vm.exportContacts();

        expect(downloadXLSX).toHaveBeenCalledWith(mockReport, {
          title: `${mockExercise.referenceNumber} ${mockTitle}`,
          sheetName: mockTitle,
          fileName: `${mockExercise.referenceNumber} - ${mockTitle}.xlsx`,
        });
      });
    });
  });
});
