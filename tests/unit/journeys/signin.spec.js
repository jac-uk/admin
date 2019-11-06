import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

const id = 12345;
const routes = [
  ['exercise-new', '/exercises/new'],
  ['exercise-show-overview', `/exercises/${id}/`],
  ['exercise-show-applications', `/exercises/${id}/applications`],
  ['exercise-show-contacts', `/exercises/${id}/contacts`],
  ['exercise-show-timeline', `/exercises/${id}/timeline`],
  ['exercise-show-shortlisting', `/exercises/${id}/shortlisting`],
  ['exercise-show-vacancy', `/exercises/${id}/vacancy`],
  ['exercise-show-eligibility', `/exercises/${id}/eligibility`],
  ['exercise-show-independent-assessors', `/exercises/${id}/independent-assessors`],
  ['exercise-edit-contacts', `/exercises/${id}/edit/contacts`],
  ['exercise-edit-shortlisting', `/exercises/${id}/edit/shortlisting`],
  ['exercise-edit-timeline', `/exercises/${id}/edit/timeline`],
  ['exercise-edit-eligibility', `/exercises/${id}/edit/eligibility`],
  ['exercise-edit-vacancy', `/exercises/${id}/edit/vacancy`],
  ['exercise-edit-name', `/exercises/${id}/edit/name`],
  ['exercise-reports-character-issues', `/exercises/${id}/report-directory/character-issues`],
  ['exercise-reports-character-checks', `/exercises/${id}/report-directory/character-checks`],
  ['exercise-reports-diversity-report', `/exercises/${id}/report-directory/diversity-report`],
  ['exercise-reports-eligibility-issues', `/exercises/${id}/report-directory/eligibility-issues`],
  ['exercise-reports-education-and-career-history', `/exercises/${id}/report-directory/education-and-career-history`],
  ['exercise-reports-jo-handover-report', `/exercises/${id}/report-directory/jo-handover-report`],
  ['exercise-reports-statutory-consultation-table', `/exercises/${id}/report-directory/statutory-consultation-table`],
  ['exercise-reports-reasonable-adjustments', `/exercises/${id}/report-directory/reasonable-adjustments`],
  ['exercise-not-found', '/errors/exercise-not-found'],
  ['page-not-found', '/errors/page-not-found'],
];

describe('Sign in journey', () => {
  let subject;
  let router;
  let store;

  beforeEach(() => {
  const localVue = createLocalVue();
    localVue.use(Router);
    localVue.use(Vuex);

    router = require('@/router').default;
    store = require('@/store').default;
    window.scrollTo = () => {};
    subject = shallowMount(App, {
      localVue,
      router,
      store,
    });
  });

  const user = {
    uid: 'abc123',
    email: 'user@judicialappointments.digital',
  };

  describe('for unauthenticated user', () => {
    describe('when they visit page sign in', () => {
      it('loads sign in page', () => {
        router.push({ name: 'sign-in' });
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe.each(routes)('when they visit page %s', (routeName) => {
      it('loads sign in page',() => {
        router.push({ name: routeName, params: { id } });
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });
  });

  describe('for authenticated user', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    describe('when going to page that does not exist', () => {
      it('redirects to the dashboard page', () => {
        router.push('/whatever');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe('when they visit page sign in', () => {
      it("redirects to the dashboard page'", () => {
        router.push({ name: 'sign-in' });
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe.each(routes)('when they visit page %s', (routeName, routePath) => {
      it(`loads ${routePath}`,() => {
        router.push({ name: routeName, params: { id } });
        expect(subject.vm.$route.path).toBe(routePath);
      });
    });
  });
});
