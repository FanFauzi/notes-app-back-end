class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this.collaborationsService = collaborationsService;
    this.notesService = notesService;
    this.validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this.notesService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this.collaborationsService.addCollaboration(noteId, userId);

    const reponse = h.reponse({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    reponse.code(201);
    return reponse;
  }

  async deleteCollaborationHandler(request) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this.notesService.verifyNoteOwner(noteId, credentialId);
    await this.collaborationsService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
