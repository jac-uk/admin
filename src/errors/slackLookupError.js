/**
 * Extend the error class to be able to catch different types
 */
export default class SlackLookupError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SlackLookupError';
  }
}
