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

  const user = {
    uid: 'abc123',
    email: 'user@judicialappointments.digital',
  };

  describe('for unauthenticated user', () => {
    describe('when they visit /dashboard', () => {
      it('redirects to /sign-in page', () => {
        router.push('/');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/new', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/new');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id/edit/contacts', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123/edit/contacts');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id/edit/shortlisting', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123/edit/shortlisting');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id/edit/timeline', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123/edit/timeline');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id/edit/eligibility', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123/edit/eligibility');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id/edit/about', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123/edit/about');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercises/:id', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercises/abc123');
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

    describe('when going to sign-in page', () => {
      it('redirects to the dashboard page', () => {
        router.push('/sign-in');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe('when going to the dashboard page', () => {
      it('can access the dashboard page', () => {
        router.push('/dashboard');
        expect(subject.vm.$route.path).toBe('/dashboard');
      });
    });

    describe('when they visit /exercises/new', () => {
      it('loads the page', () => {
        router.push('/exercises/new');
        expect(subject.vm.$route.path).toBe('/exercises/new');
      });
    });

    describe('when they visit /exercises/:id/edit/contacts', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123/edit/contacts');
        expect(subject.vm.$route.path).toBe('/exercises/abc123/edit/contacts');
      });
    });

    describe('when they visit /exercises/:id/edit/shortlisting', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123/edit/shortlisting');
        expect(subject.vm.$route.path).toBe('/exercises/abc123/edit/shortlisting');
      });
    });

    describe('when they visit /exercises/:id/edit/timeline', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123/edit/timeline');
        expect(subject.vm.$route.path).toBe('/exercises/abc123/edit/timeline');
      });
    });

    describe('when they visit /exercises/:id/edit/eligibility', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123/edit/eligibility');
        expect(subject.vm.$route.path).toBe('/exercises/abc123/edit/eligibility');
      });
    });

    describe('when they visit /exercises/:id/edit/about', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123/edit/about');
        expect(subject.vm.$route.path).toBe('/exercises/abc123/edit/about');
      });
    });

    describe('when they visit /exercises/:id', () => {
      it('loads the page', () => {
        router.push('/exercises/abc123');
        expect(subject.vm.$route.path).toBe('/exercises/abc123');
      });
    });
  });
});
