import { shallowMount, createLocalVue } from '@vue/test-utils';

const mocks = {
  route: {
    name: 'name-of-current-route',
    params: {
      id: 'abc123',
    },
  },
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
  store: {
    dispatch: jest.fn(),
    state: {
      vacancy: {
        record: { 
          typeOfExercise: null,
          referenceNumber: null,
          welshRequirement: null,
          unknownVariable: null,
          // shortlistingOutcomeDate: null, see confirmation.spec.js
        },
      },
      candidate: {
        record: {
          // personalDetails: null, see personaldetails.spec
        },
      },
      application: {
        record: { progress: { started: true } },
      },
      applications: {
        records: [],
      },
    },
    getters: {
      'vacancy/getCloseDate': new Date(),
      'vacancy/id': jest.fn(),
      'application/data': () => jest.fn(),
      'vacancies/bind': () => jest.fn(), //see views/vacancies.spec.js
    },
  },
};

const localVue = createLocalVue();

const createTestSubject = (component, customMountOptions = {
  mocks: {},
  stubs: [],
  propsData: {},
}) => {
  return shallowMount(component, {
    localVue,
    mocks: {
      $route: mocks.route,
      $router: mocks.router,
      $store: mocks.store,
      ...customMountOptions.mocks,
    },
    stubs: [...customMountOptions.stubs],
    propsData: { ...customMountOptions.propsData },
  });
};

export {
  mocks,
  createTestSubject
};
