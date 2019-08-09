import store from '@/store';
import Vuex from 'vuex';

jest.mock('vuex', () => {
  return {
    Store: jest.fn((config) => {
      return config;
    }),
  };
});

describe('Vuex store', () => {
  it('has strict mode enabled', () => {
    expect(store.strict).toBe(true);
  });

  it('creates a new Vuex Store', () => {
    expect(Vuex.Store).toHaveBeenCalled();
  });

  describe('init action', () => {
    it('calls dispatch if user is signed in', () => {
      store.getters.isSignedIn = true;
      const dispatch = jest.fn().mockResolvedValue();
      store.actions.init({ dispatch });

      expect(dispatch).toHaveBeenCalled();
    });

     it('not calling dispatch if user is not signed in', () => {
      store.getters.isSignedIn = false;
      const dispatch = jest.fn().mockResolvedValue();
      store.actions.init({ dispatch });

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
