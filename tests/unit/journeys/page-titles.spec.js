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

  describe('New Exercise Page', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Create new exercise', () => {
      router.push('/exercise/new');
      expect(document.title).toContain('Create new exercise');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/new');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('CreateAnExercise', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Create An Exercise', () => {
      router.push('/exercise/new/create-an-exercise');
      expect(document.title).toContain('Create An Exercise');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/new/create-an-exercise');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('AddExerciseContacts', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Add Exercise Contacts', () => {
      router.push('/exercise/new/create-an-exercise');
      expect(document.title).toContain('Create An Exercise');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/new/add-exercise-contacts');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('AddShortlistingMethods', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Add Shortlisting Methods', () => {
      router.push('/exercise/new/add-shortlisting-methods');
      expect(document.title).toContain('Add Shortlisting Methods');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/new/add-shortlisting-methods');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('AddExerciseTimeline', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as Add Exercise Timeline', () => {
      router.push('/exercise/new/add-exercise-timeline');
      expect(document.title).toContain('Add Exercise Timeline');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/new/add-exercise-timeline');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });

  describe('Exercise Details', () => {

    beforeEach(() => {
      store.dispatch('setCurrentUser', user);
    });

    it('sets title as About The Selection Process', () => {
      router.push('/exercise/details');
      expect(document.title).toContain('View exercise details');
    });

    it('contains Judicial Appointments Commission', () => {
      router.push('/exercise/details');
      expect(document.title).toContain('Judicial Appointments Commission');
    });
  });
});
