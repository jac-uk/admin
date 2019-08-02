import {shallowMount, createLocalVue} from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

jest.mock('@/firebase', () => ({
  auth: jest.fn(() => ({
    signOut: jest.fn(),
  })),
}));

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
    describe('when they visit /', () => {
      it('redirects to /sign-in', () => {
        router.push('/');
        expect(subject.vm.$route.path).toBe('/sign-in');
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
      it('redirects to home page', () => {
        router.push('/whatever');
        expect(subject.vm.$route.path).toBe('/');
      });
    });

    describe('when going to the home page', () => {
      it('can access home page', () => {
        router.push('/');
        expect(subject.vm.$route.path).toBe('/');
      });
    });

    describe('when going to sign-in page', () => {
      it('redirects to home page', () => {
        router.push('/sign-in');
        expect(subject.vm.$route.path).toBe('/');
      });
    });
  });
});
