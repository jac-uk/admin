//import { shallowMount, createLocalVue } from '@vue/test-utils';
import { shallowMount } from '@vue/test-utils';

import * as filters from '@jac-uk/jac-kit/filters/filters';
import { vi } from 'vitest';

const mocks = {
  route: {
    name: 'name-of-current-route',
    params: {
      id: 'abc123',
      applicationId: 'application1',
    },
  },
  router: {
    push: vi.fn(),
    replace: vi.fn(),
  },
  store: {
    dispatch: vi.fn(),
    state: {
      auth: {
        currentUser: {
          role: 'superadmin',
        },
      },
      vacancy: {
        record: {
          typeOfExercise: null,
          referenceNumber: null,
          isCourtOrTribunal: null,
          appointmentType: null,
          welshRequirement: null,
        },
      },
      candidate: {
        record: {
        },
      },
      application: {
        record: {
          progress: { started: true },
        },
      },
      applications: {
        records: [],
      },
      exerciseDocument: {
        record: {},
      },
    },
    getters: {
      'vacancy/getCloseDate': new Date(),
      'vacancy/id': vi.fn(),
      'application/data': vi.fn(),
      'vacancies/bind': vi.fn(), //see views/vacancies.spec.js
    },
  },
};

//const localVue = createLocalVue();

// Register global filters
// Object.keys(filters)
//   .forEach((filterName) => {
//     localVue.filter(filterName, filters[filterName]);
//   });

const createTestSubject = (component, customMountOptions = {
  mocks: {},
  stubs: [],
  propsData: {},
}) => {
  return shallowMount(component, {
    //localVue,
    // mocks: {
    //   $route: mocks.route,
    //   $router: mocks.router,
    //   $store: mocks.store,
    //   ...customMountOptions.mocks,
    // },
    // stubs: [...customMountOptions.stubs],
    // propsData: { ...customMountOptions.propsData },

    global: {
      mocks: {
        $route: mocks.route,
        $router: mocks.router,
        $store: mocks.store,
        ...customMountOptions.mocks,
      },
      stubs: [...customMountOptions.stubs],
      propsData: { ...customMountOptions.propsData },
      filters: filters,
    },
  });
};

export {
  mocks,
  createTestSubject
};
