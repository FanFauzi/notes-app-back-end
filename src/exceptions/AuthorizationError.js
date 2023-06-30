const ClientError = require('./ClientError');

class AurhorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AurhorizationError';
  }
}

module.exports = AurhorizationError;
