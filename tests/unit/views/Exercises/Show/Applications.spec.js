import Applications from '@/views/Exercises/Show/Applications';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

localVue.filter('lookup', jest.fn());

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
    professionalBackground: [
      'solicitor',
      'other-professional-background',
    ],
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

const mockContacts  = [{
  Ref: 'mock ref 1',
  Status: 'mock status 1',
  Name: 'mock name 1',
  Email: 'mock@email.one',
  Phone: '0987654321',
  FirstAssessorName: 'mock assessor 1 name',
  FirstAssessorEmail: 'mock assessor 1 email',
  FirstAssessorPhone: 'mock assessor 1 phone',
  SecondAssessorName: 'mock assessor 2 name',
  SecondAssessorEmail: 'mock@email.two',
  SecondAssessorPhone: '0123456789',
}];

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
      let wrapper = createTestSubject();
      expect(wrapper.find('table').exists()).toBe(true);
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
        expect(flattened).toStartWith('"');
        expect(flattened).toEndWith('"');
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
        expect(flattened).toBe('"Barrister"');
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
        expect(flattened).toStartWith('"');
        expect(flattened).toEndWith('"');
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
        expect(flattened).toBe('"Solicitor"');
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

      it('returns an array with one row per application', () => {
        const contacts = wrapper.vm.gatherContacts();

        expect(contacts).toBeArrayOfSize(mockApplications.length);
      });

      it('returns array rows containing objects with selected fields', () => {
        const contacts = wrapper.vm.gatherContacts();

        const keys = [
          'Ref',
          'Status',
          'Name',
          'Email',
          'Phone',
          'DateOfBirth',
          'Gender',
          'Disability',
          'EthnicGroup',
          'CurrentLegalRole',
          'ProfessionalBackground',
          'AttendedUKStateSchool',
          'FirstGenerationStudent',
          'FirstAssessorName',
          'FirstAssessorEmail',
          'FirstAssessorPhone',
          'SecondAssessorName',
          'SecondAssessorEmail',
          'SecondAssessorPhone',
        ];

        expect(contacts[0]).toBeObject();
        expect(Object.keys(contacts[0])).toEqual(keys);
      });

    });

    describe('buildCsv', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.buildCsv).toBe('function');
      });

      it('returns a string with CSV header', () => {
        const csv = wrapper.vm.buildCsv(mockContacts);

        expect(csv).toBeString();
        expect(csv).toStartWith('data:text/csv;charset=utf-8,');
      });

      it('returns a string containing header row with expected keys', () => {
        const csv = wrapper.vm.buildCsv(mockContacts);

        expect(csv).toEqual(expect.stringContaining(Object.keys(mockContacts).join(',')));
      });

      it('returns a string containing row width data', () => {
        const csv = wrapper.vm.buildCsv(mockContacts);

        const encodedData = encodeURI(Object.values(mockContacts[0]).join(';'));

        expect(csv).toEqual(expect.stringContaining(encodedData));
      });
    });

    describe('downloadContacts()', () => {
      jest.spyOn(document, 'createElement');

      it('is a function', () => {
        expect(typeof wrapper.vm.downloadContacts).toBe('function');
      });

      it('creates a download link', () => {
        jest.spyOn(document, 'createElement');
        wrapper.vm.downloadContacts();
        expect(document.createElement).toHaveBeenCalled();
      });
    });
  });
});
