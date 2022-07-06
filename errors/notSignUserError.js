module.exports = class NotSignUserError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
