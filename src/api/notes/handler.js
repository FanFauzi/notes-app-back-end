class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postNoteHandler(request, h) {
    this.validator.validateNotePayload(request.payload);
    const { title = 'untitled', body, tags } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const noteId = await this.service.addNote({
      title, body, tags, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    // console.error(response);
    response.code(201);
    return response;
  }

  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    // console.log(request.auth.credentials);
    // console.log(credentialId);
    const notes = await this.service.getNotes(credentialId);
    // // console.log(notes);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteAccess(id, credentialId);
    const note = await this.service.getNoteById(id);
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  async putNoteByIdHandler(request) {
    this.validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteAccess(id, credentialId);
    await this.service.editNoteById(id, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteOwner(id, credentialId);
    await this.service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;
