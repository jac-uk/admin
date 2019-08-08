import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

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

    subject = shallowMount(App, {
      localVue,
      router,
      store,
    });
  });

  describe('for unauthenticated user', () => {
    describe('when they visit /dashboard', () => {
      it('redirects to /sign-in and passes the title in meta', () => {
        router.push('/');
        expect(subject.vm.$route.path).toBe('/sign-in');
        expect(subject.vm.$route.meta.title).toBe('Sign In');
      });
    });
  });

  describe('for authenticated user', () => {
    const user = {
      uid: 'abc123',
      email: 'user@judicialappointments.digital',
    };

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    describe('when going to page that does not exist', () => {
      it('redirects to the dashboard page and passes the title in meta', () => {
        router.push('/whatever');
        expect(subject.vm.$route.path).toBe('/dashboard');
        expect(subject.vm.$route.meta.title).toBe('Dashboard');
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

    describe('page title', () => {
      it('always contains Judicial Appointments Commission', () => {
        expect(document.title).toContain('Judicial Appointments Commission');
      });
    });
  });
});
