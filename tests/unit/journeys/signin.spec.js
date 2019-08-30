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

    describe('when they visit /exercise/new/eligibility', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/eligibility');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/about-the-role', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/about-the-role');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/create-an-exercise', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/create-an-exercise');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/add-exercise-contacts', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/add-exercise-contacts');
        expect(subject.vm.$route.path).toBe('/sign-in');
      });
    });

    describe('when they visit /exercise/new/about-the-selection-process', () => {
      it('redirects to /sign-in page', () => {
        router.push('/exercise/new/about-the-selection-process');
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

    describe('when going to the new exercise page', () => {
      it('can access the new exercise page', () => {
        router.push('/exercise/new');
        expect(subject.vm.$route.path).toBe('/exercise/new');
      });
    });

    describe('when going to the new eligibility page', () => {
      it('can access the new eligibility page', () => {
        router.push('/exercise/new/eligibility');
        expect(subject.vm.$route.path).toBe('/exercise/new/eligibility');
      });
    });

    describe('when going to the about the role page', () => {
      it('can access the new about the role page', () => {
        router.push('/exercise/new/about-the-role');
        expect(subject.vm.$route.path).toBe('/exercise/new/about-the-role');
      });
    });

    describe('when going to the create an exercise page', () => {
      it('can access the new create an exercise page', () => {
        router.push('/exercise/new/create-an-exercise');
        expect(subject.vm.$route.path).toBe('/exercise/new/create-an-exercise');
      });
    });

    describe('when going to the add exercise contacts page', () => {
      it('can access the new add exercise contacts page', () => {
        router.push('/exercise/new/add-exercise-contacts');
        expect(subject.vm.$route.path).toBe('/exercise/new/add-exercise-contacts');
      });
    });

    describe('when going to the about the selection process page', () => {
      it('can access the new about the selection process page', () => {
        router.push('/exercise/new/about-the-selection-process');
        expect(subject.vm.$route.path).toBe('/exercise/new/about-the-selection-process');
      });
    });
  });
});
