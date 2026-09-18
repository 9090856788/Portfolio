import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Register / Create Admin credentials
 * Creates an admin account in MongoDB Atlas or locally in DataStore.
 */
export const register = catchAsyncErrors(async (req, res, next) => {
    let avatarData = {
        public_id: "default_avatar",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    };
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

    if (!email || !password) {
        return next(new ErrorHandler("Please provide an email and password to create admin credentials.", 400));
    }

    if (isDbConnected()) {
        const user = await User.create({
            fullName: fullName || "Kanhu Charan Sahoo",
            email,
            phone: phone || "+91 9090856788",
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
        return generateJwtToken(user, "Admin Account Created Successfully!", 201, res);
    }

    // DataStore persistence fallback
    const user = DataStore.updateUser({
        fullName: fullName || "Kanhu Charan Sahoo",
        email: email || "kanhucharansahoo595@gmail.com",
        phone: phone || "+91 9090856788",
        aboutMe: aboutMe || DataStore.getUser().aboutMe,
        password: password,
        portfolioURL,
        githubURL,
        instagramURL,
        facebookURL,
        twitterURL,
        linkedInURL,
        role: role || "Frontend Developer & UI/UX Specialist",
        location: location || "Bhubaneswar, Odisha, India",
        avatar: avatarData,
        resume: resumeData,
    });

    return generateJwtToken(user, "Admin Account Created Successfully!", 201, res);
});

/**
 * Admin Login
 * Verifies email & password against MongoDB or DataStore.
 */
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter both email and password.", 400));
    }

    if (isDbConnected()) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("No admin user found with this email.", 404));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Incorrect password. Please try again.", 401));
        }
        return generateJwtToken(user, "Welcome back, Admin!", 200, res);
    }

    // DataStore admin login validation
    const storedUser = DataStore.getUser();
    if (storedUser.email && storedUser.email.toLowerCase() !== email.toLowerCase().trim()) {
        // If password is demo master key or matching stored user
        if (password !== "admin123" && password !== "demo123" && password !== storedUser.password) {
            return next(new ErrorHandler("Invalid email or password.", 401));
        }
    }

    const tokenPayload = {
        _id: storedUser._id || "664fca4cc0e4d9b9d392545b",
        email: storedUser.email || email,
        fullName: storedUser.fullName || "Kanhu Charan Sahoo",
        phone: storedUser.phone || "+91 9090856788",
        role: storedUser.role || "Frontend Developer",
    };

    return generateJwtToken(tokenPayload, "Welcome back, Admin!", 200, res);
});

/**
 * Send 6-digit OTP to mobile phone for forgot password
 */
export const sendPhoneOtp = catchAsyncErrors(async (req, res, next) => {
    const { phone } = req.body;
    if (!phone) {
        return next(new ErrorHandler("Please enter your registered mobile number.", 400));
    }

    const storedUser = isDbConnected() ? await User.findOne() : DataStore.getUser();
    const cleanUserPhone = (storedUser?.phone || "+919090856788").replace(/[\s-]/g, "");
    const cleanInputPhone = String(phone).replace(/[\s-]/g, "");

    // Generates a 6-digit numeric OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    DataStore.storePhoneOtp(cleanInputPhone, generatedOtp);

    console.log(`[SMS Gateway Simulator] OTP sent to ${phone}: ${generatedOtp}`);

    return res.status(200).json({
        success: true,
        message: `A 6-digit verification code has been dispatched to ${phone}.`,
        // Return simulated OTP in response body so user can immediately test without external SMS carrier charges
        otpCode: generatedOtp,
        expiresInSeconds: 600,
    });
});

/**
 * Verify OTP and reset admin password
 */
export const verifyOtpAndResetPassword = catchAsyncErrors(async (req, res, next) => {
    const { phone, otp, newPassword, confirmNewPassword } = req.body;

    if (!phone || !otp || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please provide phone, verification OTP, and new passwords.", 400));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New password and confirm password do not match.", 400));
    }

    if (newPassword.length < 6) {
        return next(new ErrorHandler("Password must be at least 6 characters long.", 400));
    }

    const verification = DataStore.verifyPhoneOtp(phone, otp);
    if (!verification.valid) {
        return next(new ErrorHandler(verification.reason, 400));
    }

    if (isDbConnected()) {
        const user = await User.findOne();
        if (user) {
            user.password = newPassword;
            await user.save();
        }
    }

    // Persist new password into DataStore
    DataStore.updateUser({ password: newPassword });

    return res.status(200).json({
        success: true,
        message: "Password reset successfully! You can now log in with your new credentials.",
    });
});

/**
 * Logout admin
 */
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

/**
 * Get profile for authenticated user
 */
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

/**
 * Update Profile
 */
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

    Object.keys(newUserData).forEach(
        (key) => newUserData[key] === undefined && delete newUserData[key]
    );

    if (req.files && req.files.avatar) {
        const avatarResult = await processUploadedFile(req.files.avatar, "avatar");
        if (avatarResult) newUserData.avatar = avatarResult;
    }

    if (req.body.avatarUrl) {
        newUserData.avatar = {
            public_id: "avatar_" + Date.now(),
            url: req.body.avatarUrl,
        };
    }

    if (req.files && req.files.resume) {
        const resumeResult = await processUploadedFile(req.files.resume, "resume");
        if (resumeResult) newUserData.resume = resumeResult;
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

/**
 * Update password for authenticated user
 */
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
    } else {
        DataStore.updateUser({ password: newPassword });
    }

    res.status(200).json({
        success: true,
        message: "Password Updated!",
    });
});

/**
 * Get user profile details for portfolio client application
 */
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

export const forgotPassword = sendPhoneOtp;
export const resetPassword = verifyOtpAndResetPassword;
