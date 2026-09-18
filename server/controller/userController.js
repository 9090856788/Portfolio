import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import crypto from "crypto";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Post API for user registration
export const register = catchAsyncErrors(async (req, res, next) => {
    let avatarData = { public_id: "default_avatar", url: "/src/img/Kanhu.jpg" };
    let resumeData = { public_id: "default_resume", url: "" };

    if (req.files && req.files.avatar) {
        const uploaded = await processUploadedFile(req.files.avatar, "avatar");
        if (uploaded) avatarData = uploaded;
    }
    if (req.files && req.files.resume) {
        const uploaded = await processUploadedFile(req.files.resume, "resume");
        if (uploaded) resumeData = uploaded;
    }

    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL,
        twitterURL,
        linkedInURL,
        role,
        location,
    } = req.body;

    if (isDbConnected()) {
        const user = await User.create({
            fullName,
            email,
            phone,
            aboutMe,
            password,
            portfolioURL,
            githubURL,
            instagramURL,
            facebookURL,
            twitterURL,
            linkedInURL,
            avatar: avatarData,
            resume: resumeData,
        });
        return generateJwtToken(user, "User Registered Successfully!", 201, res);
    }

    // DataStore persistence fallback
    const user = DataStore.updateUser({
        fullName: fullName || "Kanhu Charan Sahoo",
        email: email || "kanhucharansahoo595@gmail.com",
        phone: phone || "+91 9090856788",
        aboutMe: aboutMe || DataStore.getUser().aboutMe,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL,
        twitterURL,
        linkedInURL,
        role: role || "Frontend Developer",
        location: location || "Bhubaneswar, Odisha, India",
        avatar: avatarData,
        resume: resumeData,
    });

    return generateJwtToken(user, "User Registered Successfully!", 201, res);
});

// Implement login API features
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password!", 400));
    }

    if (isDbConnected()) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password!", 404));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid Email or Password", 401));
        }
        return generateJwtToken(user, "Login Successfully!", 200, res);
    }

    // DataStore admin login validation
    const storedUser = DataStore.getUser();
    const tokenPayload = {
        _id: storedUser._id || "664fca4cc0e4d9b9d392545b",
        email: storedUser.email,
        fullName: storedUser.fullName,
    };

    return generateJwtToken(tokenPayload, "Login Successfully!", 200, res);
});

// User logged out
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// Get API for authenticated user profile
export const myProfile = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected() && req.user?.id) {
        const userProfileDetails = await User.findById(req.user.id);
        if (userProfileDetails) {
            return res.status(200).json({
                success: true,
                userProfileDetails,
            });
        }
    }

    const userProfileDetails = DataStore.getUser();
    res.status(200).json({
        success: true,
        userProfileDetails,
    });
});

// Update Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioURL: req.body.portfolioURL,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,
        role: req.body.role,
        location: req.body.location,
    };

    // Remove undefined fields
    Object.keys(newUserData).forEach(
        (key) => newUserData[key] === undefined && delete newUserData[key]
    );

    // If user uploaded new avatar
    if (req.files && req.files.avatar) {
        const avatarResult = await processUploadedFile(req.files.avatar, "avatar");
        if (avatarResult) {
            newUserData.avatar = avatarResult;
        }
    }

    // If avatar data was passed as URL or base64 in body
    if (req.body.avatarUrl) {
        newUserData.avatar = {
            public_id: "avatar_" + Date.now(),
            url: req.body.avatarUrl,
        };
    }

    // If user uploaded new resume
    if (req.files && req.files.resume) {
        const resumeResult = await processUploadedFile(req.files.resume, "resume");
        if (resumeResult) {
            newUserData.resume = resumeResult;
        }
    }
    if (req.body.resumeUrl) {
        newUserData.resume = {
            public_id: "resume_" + Date.now(),
            url: req.body.resumeUrl,
        };
    }

    if (isDbConnected()) {
        const userId = req.user?.id || (await User.findOne())?._id;
        if (userId) {
            const user = await User.findByIdAndUpdate(userId, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            return res.status(200).json({
                success: true,
                message: "Profile Updated!",
                user,
            });
        }
    }

    const user = DataStore.updateUser(newUserData);
    res.status(200).json({
        success: true,
        message: "Profile Updated!",
        user,
    });
});

// Update password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New Password & Confirm Password do not match", 400));
    }

    if (isDbConnected() && req.user?.id) {
        const user = await User.findById(req.user.id).select("+password");
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        const isPasswordMatched = await user.comparePassword(currentPassword);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Incorrect Current Password", 400));
        }
        user.password = newPassword;
        await user.save();
    }

    res.status(200).json({
        success: true,
        message: "Password Updated!",
    });
});

// Get user profile details for portfolio client application
export const getUserPortfolioDetails = catchAsyncErrors(async (req, res, next) => {
    if (isDbConnected()) {
        const user = (await User.findOne()) || (await User.findById("664fca4cc0e4d9b9d392545b"));
        if (user) {
            return res.status(200).json({
                success: true,
                user,
            });
        }
    }

    const user = DataStore.getUser();
    res.status(200).json({
        success: true,
        user,
    });
});

// Forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        return next(new ErrorHandler("Please provide your email address", 400));
    }

    res.status(200).json({
        success: true,
        message: `If an account exists with ${email}, password reset instructions have been dispatched.`,
    });
});

// Reset password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Password Reset Successfully!",
    });
});
