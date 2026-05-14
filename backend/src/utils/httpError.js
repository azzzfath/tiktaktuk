class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function createHttpError(status, message) {
  return new HttpError(status, message);
}

module.exports = {
  HttpError,
  createHttpError,
};
