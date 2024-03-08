/**
 * Extend the error class to be able to catch different types
 */
export default class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }
}
