const ExportNotesPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportNotesPayload: (paylaod) => {
    const validationResult = ExportNotesPayloadSchema.validate(paylaod);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
