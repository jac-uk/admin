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

    describe('when they visit /exercise/new/add-exercise-contacts', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/add-exercise-contacts');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/add-shortlisting-methods', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/add-shortlisting-methods');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/add-exercise-timeline', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/add-exercise-timeline');
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

    describe('when going to the add exercise contacts page', () => {
      it('can access the new add exercise contacts page', () => {
        router.push('/exercise/new/add-exercise-contacts');
        expect(subject.vm.$route.path).toBe('/exercise/new/add-exercise-contacts');
      });
    });

    describe('when going to the add shortlisting methods page', () => {
      it('can access the new add shortlisting methods page', () => {
        router.push('/exercise/new/add-shortlisting-methods');
        expect(subject.vm.$route.path).toBe('/exercise/new/add-shortlisting-methods');
      });
    });

    describe('when going to the add exercise timeline page', () => {
      it('can access the new add exercise timeline page', () => {
        router.push('/exercise/new/add-exercise-timeline');
        expect(subject.vm.$route.path).toBe('/exercise/new/add-exercise-timeline');
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
