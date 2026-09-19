class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || { email: "email" }).join(", ");
        message = `An account with this ${field} already exists. Please log in instead.`;
        statusCode = 400;
    } else if (err.name === "JsonWebTokenError") {
        message = "Session token is invalid. Please log in again.";
        statusCode = 401;
    } else if (err.name === "TokenExpiredError") {
        message = "Session token has expired. Please log in again.";
        statusCode = 401;
    } else if (err.name === "CastError") {
        message = `Resource not found with invalid identifier: ${err.path}`;
        statusCode = 404;
    } else if (err.errors) {
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(" ");
    }

    return res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export default ErrorHandler;
