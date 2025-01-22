class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    public message: string = "Server error",
    public errors: any[] = [],
    public stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
