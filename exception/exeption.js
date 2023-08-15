class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 400;
    if (!message) this.message = "요청한 데이터 형식이 올바르지 않습니다.";

    this.errorResponse = {
      success: false,
      message: this.message,
      status: this.status,
    };
  }

  getErrorResponse() {
    return this.errorResponse;
  }
}
module.exports = CustomError;
