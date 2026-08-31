class AppError extends Error {
  statusCode: number;
  statusText: string;
  constructor() {
    super();
    this.statusCode = 0;
    this.statusText = "";
  }

  create(message: string, statusCode: number, statusText: string) {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this;
  }
}

const apiError = new AppError();

export default apiError;
