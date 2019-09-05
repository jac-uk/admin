import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '@/App';
import Router from 'vue-router';
import Vuex from 'vuex';

describe('Page titles', () => {
  let router;
  let store;

  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Router);
    localVue.use(Vuex);

    router = require('@/router').default;
    store = require('@/store').default;

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

  describe('/exercises/new', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push('/exercises/new');
    });

    it('sets title as Create An Exercise', () => {
      expect(document.title).toContain('Create An Exercise');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('/exercises/:id/edit/contacts', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push('/exercises/abc123/edit/contacts');
    });

    it('sets title as Add Exercise Contacts', () => {
      expect(document.title).toContain('Add Exercise Contacts');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('/exercises/:id/edit/add-shortlisting-methods', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push('/exercises/abc123/edit/add-shortlisting-methods');
    });

    it('sets title as Add Exercise Contacts', () => {
      expect(document.title).toContain('Add Shortlisting Methods');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('/exercises/:id/edit/add-exercise-timeline', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push('/exercises/abc123/edit/add-exercise-timeline');
    });

    it('sets title as Add Exercise Contacts', () => {
      expect(document.title).toContain('Add Exercise Timeline');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('/exercises/:id', () => {
    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
      router.push('/exercises/abc123');
    });

    it('sets title as About The Selection Process', () => {
      expect(document.title).toContain('View exercise details');
    });

    it('contains Judicial Appointments Commission', () => {
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });
});
