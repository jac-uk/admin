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
  Name: 'mock name 1',
  Email: 'mock@email.one',
  Phone: '0987654321',
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

describe('@/views/Exercises/Show', () => {
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

    describe('gatherContacts()', () => {
      it('is a function', () => {
        expect(typeof wrapper.vm.gatherContacts).toBe('function');
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
      //buildCsv(contacts) {
      //        let csvContent = 'data:text/csv;charset=utf-8,';


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
