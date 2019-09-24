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
  ['exercise-edit-contacts', `/exercises/${id}/edit/contacts`],
  ['exercise-edit-shortlisting', `/exercises/${id}/edit/shortlisting`],
  ['exercise-edit-timeline', `/exercises/${id}/edit/timeline`],
  ['exercise-edit-eligibility', `/exercises/${id}/edit/eligibility`],
  ['exercise-edit-vacancy', `/exercises/${id}/edit/vacancy`],
  ['exercise-not-found', '/exercise-not-found'],
  ['page-not-found', '/page-not-found'],
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
