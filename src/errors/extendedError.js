/**
 * Extend the error class to be able to append extra data to it.
 * - Add the ability to bind a routerLink.
 */
export default class ExtendedError extends Error {
  constructor({ message, routerLink = '' }) {
    super(message);
    this.routerLink = routerLink;
  }
}
