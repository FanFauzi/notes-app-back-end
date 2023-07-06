class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this.authenticationsService = authenticationsService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    // validasi login, properti -> {username, password}
    this.validator.validatePostAuthenticationPayload(request.payload);
    // mengambil nilai -> {username, password}
    const { username, password } = request.payload;
    // memeriksa kredensial pada request.payload
    // menampung nilai id ke variable id
    const id = await this.usersService.verifyUserCredential(username, password);
    // membuat access token dan refresh token
    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });
    // menyimpan refresh token ke database agar bisa memperbarui access token
    await this.authenticationsService.addRefreshToken(refreshToken);
    // mengembalikan request dengan response yang membawa accessToken dan refreshToken di data body
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    // memastikan payload request mengandung properti refreshToken yang bernilai string
    this.validator.validatePutAuthenticationPayload(request.payload);
    // setelah divalidasi,dapatkan nilai refreshToken
    const { refreshToken } = request.payload;
    // verifikasi refreshToken dari sisi database dan signature token
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
    // membuat accessToken baru agar identitas pengguna tidak berubah
    const accessToken = this.tokenManager.generateAccessToken({ id });
    // dan melampirkanya sebagai data di body response
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    // validasi refreshToken dari request.payload
    this.validator.validateDeleteAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    // cek refreshToken di database
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    // menghapus refreshToken
    await this.authenticationsService.deleteRefreshToken(refreshToken);
    // membuat response
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
