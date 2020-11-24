import Applications from '@/views/Exercises/Show/Applications';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { downloadXLSX } from '@/helpers/export';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

localVue.filter('lookup', jest.fn());
localVue.filter('showAlternative', jest.fn());

jest.mock('@/helpers/export', () => {
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

describe('@/views/Exercises/Show/Applications', () => {
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

    describe('flattenCurrentLegalRole', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.flattenCurrentLegalRole).toBe('function');
      });

      it('returns empty string if no argument supplied', () => {
        const flattened = wrapper.vm.flattenCurrentLegalRole();

        expect(flattened).toBe('');
      });

      it('returns empty string if argument doesn\'t contain currentLegalRole', () => {
        const flattened = wrapper.vm.flattenCurrentLegalRole({});

        expect(flattened).toBe('');
      });

      it('returns a flattened string if argument contains a valid currentLegalRole', () => {
        const flattened = wrapper.vm.flattenCurrentLegalRole(mockApplication.equalityAndDiversitySurvey);

        expect(flattened).toBeString();
        expect(flattened).toEqual(expect.stringContaining('Barrister'));
        expect(flattened).toEqual(expect.stringContaining(mockApplication.equalityAndDiversitySurvey.otherCurrentLegalRoleDetails));
      });

      it('only returns otherCurrentLegalRoleDetails when other has been selected', () => {
        let flattened = wrapper.vm.flattenCurrentLegalRole({
          currentLegalRole: [
            'barrister',
          ],
          otherCurrentLegalRoleDetails: 'mock role details',
        });
        expect(flattened).toBe('Barrister');

        flattened = wrapper.vm.flattenCurrentLegalRole({
          currentLegalRole: [
            'barrister',
            'other-current-legal-role',
          ],
          otherCurrentLegalRoleDetails: 'mock role details',
        });
        expect(flattened).toEqual(expect.stringContaining('Barrister'));
        expect(flattened).toEqual(expect.stringContaining('mock role details'));
      });

    });

    describe('flattenProfessionalBackground', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.flattenProfessionalBackground).toBe('function');
      });

      it('returns empty string if no argument supplied', () => {
        const flattened = wrapper.vm.flattenProfessionalBackground();
        expect(flattened).toBe('');
      });

      it('returns empty string if argument doesn\'t contain professionalBackground', () => {
        const flattened = wrapper.vm.flattenProfessionalBackground({});
        expect(flattened).toBe('');
      });

      it('returns a flattened string if argument contains a valid professionalBackground', () => {
        const flattened = wrapper.vm.flattenProfessionalBackground(mockApplication.equalityAndDiversitySurvey);
        expect(flattened).toBeString();
        expect(flattened).toEqual(expect.stringContaining('Solicitor'));
        expect(flattened).toEqual(expect.stringContaining(mockApplication.equalityAndDiversitySurvey.otherProfessionalBackgroundDetails));
      });

      it('only returns otherProfessionalBackgroundDetails when other has been selected', () => {
        let flattened = wrapper.vm.flattenProfessionalBackground({
          professionalBackground: [
            'solicitor',
          ],
          otherProfessionalBackgroundDetails: 'mock background details',
        });
        expect(flattened).toBe('Solicitor');
        flattened = wrapper.vm.flattenProfessionalBackground({
          professionalBackground: [
            'solicitor',
            'other-professional-background',
          ],
          otherProfessionalBackgroundDetails: 'mock background details',
        });
        expect(flattened).toEqual(expect.stringContaining('Solicitor'));
        expect(flattened).toEqual(expect.stringContaining('mock background details'));
      });

    });

    describe('attendedUKStateSchool()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.attendedUKStateSchool).toBe('function');
      });

      it('returns empty string if no argument supplied', () => {
        const result = wrapper.vm.attendedUKStateSchool();
        expect(result).toBe('');
      });

      it('returns empty string if argument doesn\'t contain stateOrFeeSchool', () => {
        const result = wrapper.vm.attendedUKStateSchool({});
        expect(result).toBe('');
      });

      it('returns \'Yes\' for \'uk-state-selective\'', () => {
        const result = wrapper.vm.attendedUKStateSchool({ stateOrFeeSchool: 'uk-state-selective' });
        expect(result).toBe('Yes');
      });

      it('returns \'Yes\' for \'uk-state-non-selective\'', () => {
        const result = wrapper.vm.attendedUKStateSchool({ stateOrFeeSchool: 'uk-state-selective' });
        expect(result).toBe('Yes');
      });

      it('returns \'No\' for anything else', () => {
        const result = wrapper.vm.attendedUKStateSchool({ stateOrFeeSchool: 'mock-school' });
        expect(result).toBe('No');
      });

    });

    describe('gatherContacts()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.gatherContacts).toBe('function');
      });

      it('calls .flattenCurrentLegalRole() to flatten currentLegalRole', () => {
        wrapper.vm.flattenCurrentLegalRole = jest.fn();

        wrapper.vm.gatherContacts();

        expect(wrapper.vm.flattenCurrentLegalRole).toHaveBeenCalledTimes(mockApplications.length);

        mockApplications.forEach((mockApp) => {
          expect(wrapper.vm.flattenCurrentLegalRole).toHaveBeenCalledWith(mockApp.equalityAndDiversitySurvey);
        });
      });

      it('calls .flattenProfessionalBackground() to flatten professionalBackground', () => {
        wrapper.vm.flattenProfessionalBackground = jest.fn();

        wrapper.vm.gatherContacts();

        expect(wrapper.vm.flattenProfessionalBackground).toHaveBeenCalledTimes(mockApplications.length);

        mockApplications.forEach((mockApp) => {
          expect(wrapper.vm.flattenProfessionalBackground).toHaveBeenCalledWith(mockApp.equalityAndDiversitySurvey);
        });
      });

      it('calls .attendedUKStateSchool() to parse stateOrFeeSchool', () => {
        wrapper.vm.attendedUKStateSchool = jest.fn();
        wrapper.vm.gatherContacts();
        expect(wrapper.vm.attendedUKStateSchool).toHaveBeenCalledTimes(mockApplications.length);
        mockApplications.forEach((mockApp) => {
          expect(wrapper.vm.attendedUKStateSchool).toHaveBeenCalledWith(mockApp.equalityAndDiversitySurvey);
        });
      });

      it('returns an array with header row and one row per application', () => {
        const contacts = wrapper.vm.gatherContacts();

        expect(contacts).toBeArrayOfSize(mockApplications.length + 1);
      });

      it('returns an array starting with header row', () => {
        const contacts = wrapper.vm.gatherContacts();

        const headers = [
          'Reference number',
          'Status',
          'Name',
          'Email',
          'Phone number',
          'Date of Birth',
          'National Insurance Number',
          'Gender',
          'Disability',
          'Ethnic Group',
          'Current Legal Role',
          'Professional Background',
          'Held Fee-paid Judicial Role',
          'Attended UK State School',
          'First Generation Student',
          'First Assessor Name',
          'First Assessor Email',
          'First Assessor Phone',
          'Second Assessor Name',
          'Second Assessor Email',
          'Second Assessor Phone',
        ];

        expect(contacts[0]).toBeArray();
        expect(contacts[0]).toEqual(headers);
      });
    });

    describe('exportContacts()', () => {

      it('is a function', () => {
        expect(typeof wrapper.vm.exportContacts).toBe('function');
      });

      it('calls gatherReportData', () => {
        wrapper.vm.gatherContacts = jest.fn();
        wrapper.vm.exportContacts();
        expect(wrapper.vm.gatherContacts).toHaveBeenCalled();
      });

      it('calls downloadXLSX', () => {
        const mockReport = 'mock report';
        const mockTitle = 'Contacts';

        wrapper.vm.gatherContacts = jest.fn().mockReturnValue(mockReport);

        wrapper.vm.exportContacts();

        expect(downloadXLSX).toHaveBeenCalledWith(mockReport, {
          title: `${mockExercise.referenceNumber} ${mockTitle}`,
          sheetName: mockTitle,
          fileName: `${mockExercise.referenceNumber} - ${mockTitle}.xlsx`,
        });
      });
    });
  });
});
