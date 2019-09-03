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
});
