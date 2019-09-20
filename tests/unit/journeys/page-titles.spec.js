import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

const exerciseRoutes = [
  ['exercise-new', 'Create An Exercise'],
  ['exercise-show-overview', 'Exercise Details | Overview'],
  ['exercise-show-applications', 'Exercise Details | Applications'],
  ['exercise-show-contacts', 'Exercise Details | Contacts'],
  ['exercise-show-timeline', 'Exercise Details | Timeline'],
  ['exercise-show-shortlisting', 'Exercise Details | Shortlisting'],
  ['exercise-show-vacancy', 'Exercise Details | Vacancy information'],
  ['exercise-show-eligibility', 'Exercise Details | Eligibility information'],
  ['exercise-edit-contacts', 'Add Exercise Contacts'],
  ['exercise-edit-shortlisting', 'Add Shortlisting Methods'],
  ['exercise-edit-timeline', 'Add Exercise Timeline'],
  ['exercise-edit-eligibility', 'Add Eligibility Information'],
  ['exercise-edit-vacancy', 'About The Vacancy'],
];

describe('Page titles', () => {
  let router;
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Router);
    localVue.use(Vuex);

    router = require('@/router').default;
    store = require('@/store').default;
    window.scrollTo = () => {};
    shallowMount(App, {
      localVue,
      router,
      store,
    });
  });

  const user = {
    uid: 'abc123',
    email: 'user@judicialappointments.digital',
  };

  describe('sign in', () => {
    beforeEach(() => {
      router.push({ name: 'sign-in' });
    });

    it('contains Sign In', () => {
      expect(document.title).toContain('Sign In');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('dashboard', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push({ name: 'dashboard' });
    });

    it('contains Dashboard', () => {
      expect(document.title).toContain('Dashboard');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe.each(exerciseRoutes)('%s', (routeName, routeTitle) => {
     beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push({ name: routeName, params: { id: 123 } });
    });

    it(`contains ${routeTitle}`, () => {
      expect(document.title).toContain(routeTitle);
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });
});
