class AppError extends Error {
    statusCode;
    statusText;
    constructor() {
        super();
        this.statusCode = 0;
        this.statusText = "";
    }
    create(message, statusCode, statusText) {
        this.message = message;
        this.statusCode = statusCode;
        this.statusText = statusText;
        return this;
    }
}
const apiError = new AppError();
export default apiError;
