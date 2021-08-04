import Application from '@/views/Exercise/Applications/Application';
import { createTestSubject } from '@/../tests/unit/helpers';

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

const mockProps = {
  exercise: {
    id: 'mockid',
  },
  status: 'mockstatus',
  activeTab: 'panel',
};

// const createTestSubject = () => {
//   return shallowMount(Application, {
//     //store,
//     localVue,
//     mocks: {
//       $route: mockRoute,
//       $router: mockRouter,
//       $store: mockStore,
//     },
//     stubs: {
//       RouterView: true,
//       RouterLink: true,
//     },
//     propsData: mockProps,
//   });
// };

describe('@/views/Exercise/Applications/Application', () => {
  describe('template', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = createTestSubject(Application, {
        propsData: mockProps,
        mocks: {
          $store: {
            getters: {
              'application/data': jest.fn(() => mockApplication),
            },
            state: {
              exerciseDocument: {
                record: mockExercise,
              },
              applications: {
                records: [mockApplication],
              },
              application: {
                record: mockApplication,
              },
            },
          },
        },
        stubs: [],
      });
      // console.log(wrapper.vm.$store.state.exerciseDocument.record);
      // wrapper = mockExercise;
    });

    it('renders the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it.only('displays application reference in header', () => {
      expect(wrapper.find('h1').text()).toEqual(expect.stringContaining(mockApplication.referenceNumber));
    });

    it('has unlock button if application completed', () => {
      const mockApp = {
        ...mockApplication,
        status: 'applied',
      };
      wrapper.vm.$store.state.application.record = mockApp;
      expect(wrapper.find('.btn-mark-as-applied').exists()).toBe(false);
      expect(wrapper.find('.btn-unlock').exists()).toBe(true);
    });

    it('has "mark as applied" if draft', () => {
      const mockApp = {
        ...mockApplication,
        status: 'draft',
      };
      wrapper.vm.$store.state.application.record = mockApp;
      expect(wrapper.find('.btn-mark-as-applied').exists()).toBe(true);
      expect(wrapper.find('.btn-unlock').exists()).toBe(false);
    });

    it('renders identifying sections in full view', () => {
      wrapper.setProps({
        activeTab: 'full',
      });

      const headers = wrapper.findAll('.application-details > div > h2');

      expect(headers.length).toBeGreaterThan(1);
      expect(headers.at(0).text()).toEqual(expect.stringContaining('Personal details'));
      expect(headers.at(1).text()).toEqual(expect.stringContaining('Character information'));
      expect(headers.at(2).text()).toEqual(expect.stringContaining('Equality and diversity information'));
    });

    // @TODO fix this test :)
    xit('doesn\'t render identifying sections in panel pack view', () => {
      wrapper.setProps({
        activeTab: 'panel',
      });

      const headers = wrapper.findAll('.application-details > div > h2');

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
