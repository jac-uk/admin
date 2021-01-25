import Vue from 'vue';
import { createLocalVue } from '@vue/test-utils';
import PermissionsPlugin from '@/plugins/PermissionsPlugin';
import { ROLES } from '@/helpers/roles';

const currentUser = {
  uid: 1,
  email: 'test@test.com',
  emailVerified: 1,
  displayName: 'Test user',
  role: ROLES.ADMIN,
  permissions: ['createExercise', 'viewExercise', 'updateExercise', 'deleteExercise', 'updateExerciseDatesAfterClose',
                'updateApplication', 'updateCandidateContactDetails', 'candidateSearch', 'updateAssessorsDetails',
                'createReports', 'triggerEmails', 'updateStateByActions', 'addNotes', 'uploadTemplates'],
};

const mockStore = {
  dispatch: jest.fn(),
  state: {
    auth: { currentUser: currentUser },
  },
};

const localVue = createLocalVue();
localVue.use(PermissionsPlugin);

describe('PermissionsPlugin', () => {

  it('adds a $hasPermission method to the Vue prototype', () => {
    expect(Vue.prototype.$hasPermission).toBeUndefined();
    expect(typeof localVue.prototype.$hasPermission).toBe('function');
  });

it('confirms if a user is permitted to perform an operation', () => {
  const result = localVue.prototype.$hasPermission('createExercise', mockStore);
  expect(result).toBeTrue();
});
  it('confirms if a user is not permitted to perform an operation', () => {
    const result = localVue.prototype.$hasPermission('createExercise2', mockStore);
    expect(result).toBeFalse();
  });
  it('confirms if a user is permitted to perform an operation (passed an array)', () => {
    const result = localVue.prototype.$hasPermission(['createExercise', 'createExercise2'], mockStore);
    expect(result).toBeTrue();
  });
  it('confirms if a user is not permitted to perform an operation (passed an array)', () => {
    const result = localVue.prototype.$hasPermission(['createExercise1', 'createExercise2'], mockStore);
    expect(result).toBeFalse();
  });
  it('no access if a user does not have a permission', () => {
    delete mockStore.state.auth.currentUser['permissions'];
    const result = localVue.prototype.$hasPermission('createExercise', mockStore);
    expect(result).toBeFalse();
  });
});

