/**
 * A basic mock of the `vuexfire` module
 */

/**
 * Method: firestoreAction
 * Docs: https://vuefire.vuejs.org/api/vuexfire.html#firestoreaction
 *
 * This is a wrapper method which injects `bindFirestoreRef` and `unbindFirestoreRef` into the
 * context object which is supplied to the action.
 *
 * In this mock, `bindFirestoreRef` and `unbindFirestoreRef` both simply return an array of the
 * parameters with which they were called. This allows us to test that we're calling these methods
 * with expected parameters.
 */
const firestoreAction = jest.fn(callback => {
  const context = {
    bindFirestoreRef: (key, ref, options) => {
      return [key, ref, options];
    },
    unbindFirestoreRef: (key) => {
      return [key];
    },
  };
  return (payload) => callback(context, payload);
});

export { firestoreAction };
