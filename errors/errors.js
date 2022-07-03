class NotValidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotYoursError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotSignUserError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  NotValidError,
  NotFoundError,
  NotYoursError,
  NotSignUserError,
  ConflictError
};
