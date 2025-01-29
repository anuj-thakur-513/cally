"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    err.message = err.message || "Server Error";
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode,
    });
};
exports.default = errorHandler;
