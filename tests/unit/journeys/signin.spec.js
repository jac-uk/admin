import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

let subject;
let router;
let store;

beforeEach(() => {
  const localVue = createLocalVue();
  localVue.use(Router);
  localVue.use(Vuex);

  router = require('@/router').default;
  store = require('@/store').default;

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

describe('Sign in journey', () => {

  describe('for unauthenticated user', () => {
    describe('when they visit /dashboard', () => {
      it('redirects to /sign-in and passes the title in meta', () => {
        router.push('/');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });
  });

  describe('for authenticated user', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    describe('when going to page that does not exist', () => {
      it('redirects to the dashboard page and passes the title in meta', () => {
        router.push('/whatever');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe('when going to the dashboard page', () => {
      it('can access the dashboard page', () => {
        router.push('/dashboard');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe('when going to sign-in page', () => {
      it('redirects to the dashboard page', () => {
        router.push('/sign-in');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });
  });
});

describe('Page titles', () => {

  describe('Sign In page', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', null);
    });

    it('sets title as Sign In', () => {
      router.push('/sign-in');
      expect(document.title).toContain('Sign In');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/sign-in');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('Dashboard Page', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Dashboard', () => {
      router.push('/dashboard');
      expect(document.title).toContain('Dashboard');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/dashboard');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });
});
