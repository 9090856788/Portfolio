import { User } from "../models/userSchema.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token; // Access the token from the cookie

    if (!token) {
        return next(new ErrorHandler("User not Authenticated!", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token", 401));
    }
});
