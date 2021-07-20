import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

const id = 12345;
const routes = [
  ['exercise-new', '/exercise/new'],
  ['exercise-show-overview', `/exercise/${id}/`],
  ['exercise-show-applications', `/exercise/${id}/applications`],
  ['exercise-show-contacts', `/exercise/${id}/contacts`],
  ['exercise-show-timeline', `/exercise/${id}/timeline`],
  ['exercise-show-shortlisting', `/exercise/${id}/shortlisting`],
  ['exercise-show-vacancy', `/exercise/${id}/vacancy`],
  ['exercise-show-eligibility', `/exercise/${id}/eligibility`],
  ['exercise-show-independent-assessments', `/exercise/${id}/independent-assessments`],
  ['exercise-edit-contacts', `/exercise/${id}/edit/contacts`],
  ['exercise-edit-shortlisting', `/exercise/${id}/edit/shortlisting`],
  ['exercise-edit-timeline', `/exercise/${id}/edit/timeline`],
  ['exercise-edit-eligibility', `/exercise/${id}/edit/eligibility`],
  ['exercise-edit-vacancy', `/exercise/${id}/edit/vacancy`],
  ['exercise-edit-name', `/exercise/${id}/edit/name`],
  ['exercise-reports-character-issues', `/exercise/${id}/report-directory/character-issues`],
  ['exercise-reports-character-checks', `/exercise/${id}/report-directory/character-checks`],
  ['exercise-reports-diversity-dashboard', `/exercise/${id}/report-directory/diversity-dashboard`],
  ['exercise-reports-eligibility-issues', `/exercise/${id}/report-directory/eligibility-issues`],
  ['exercise-reports-education-and-career-history', `/exercise/${id}/report-directory/education-and-career-history`],
  ['exercise-reports-jo-handover-report', `/exercise/${id}/report-directory/jo-handover-report`],
  ['exercise-reports-statutory-consultation-table', `/exercise/${id}/report-directory/statutory-consultation-table`],
  ['exercise-reports-reasonable-adjustments', `/exercise/${id}/report-directory/reasonable-adjustments`],
  ['exercise-not-found', '/errors/exercise-not-found'],
  ['page-not-found', '/errors/page-not-found'],
];

xdescribe('Sign in journey', () => {
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
      store.dispatch('auth/setCurrentUser', user);
    });

    describe('when going to page that does not exist', () => {
      it('redirects to the exercises page', () => {
        router.push('/whatever');
        expect(subject.vm.$route.path).toBe('/exercises');
      });
    });

    describe('when they visit page sign in', () => {
      it("redirects to the exercises page'", () => {
        router.push({ name: 'sign-in' });
        expect(subject.vm.$route.path).toBe('/exercises');
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
