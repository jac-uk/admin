import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

const routes = [
  ['exercise-new', 'Create An Exercise'],
  ['exercise-show-overview', 'Exercise Details | Overview'],
  ['exercise-show-applications', 'Exercise Details | Applications'],
  ['exercise-show-contacts', 'Exercise Details | Contacts'],
  ['exercise-show-timeline', 'Exercise Details | Timeline'],
  ['exercise-show-shortlisting', 'Exercise Details | Shortlisting'],
  ['exercise-show-vacancy', 'Exercise Details | Vacancy information'],
  ['exercise-show-eligibility', 'Exercise Details | Eligibility information'],
  ['exercise-show-independent-assessments', 'Exercise Details | Independent Assessments'],
  ['exercise-edit-contacts', 'Contacts'],
  ['exercise-edit-shortlisting', 'Shortlisting Methods'],
  ['exercise-edit-timeline', 'Timeline'],
  ['exercise-edit-eligibility', 'Eligibility Information'],
  ['exercise-edit-vacancy', 'Vacancy Information'],
  ['exercise-edit-name', 'Update exercise name'],
  ['exercise-not-found', 'Exercise Not Found'],
  ['page-not-found', 'Page Not Found'],
  ['exercise-reports-character-checks', 'Character Checks'],
  ['exercise-reports-character-issues', 'Character Issues'],
  ['exercise-reports-diversity-dashboard', 'Diversity Dashboard'],
  ['exercise-reports-eligibility-issues', 'Eligibility Issues'],
  ['exercise-reports-education-and-career-history', 'Education and Career History'],
  ['exercise-reports-jo-handover-report', 'JO Handover Report'],
  ['exercise-reports-statutory-consultation-table', 'Statutory Consultation Table'],
  ['exercise-reports-reasonable-adjustments', 'Reasonable Adjustments'],
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
      store.dispatch('auth/setCurrentUser', user);
      router.push({ name: 'dashboard' });
    });

    it('contains Dashboard', () => {
      expect(document.title).toContain('Dashboard');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe.each(routes)('%s', (routeName, routeTitle) => {
     beforeEach(() => {
       store.dispatch('auth/setCurrentUser', user);
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
