import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { processUploadedFile } from "../utils/fileHandler.js";
import { DataStore } from "../data/store.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Register / Create Admin credentials
 * Creates an admin account in MongoDB Atlas or locally in DataStore.
 */
export const register = catchAsyncErrors(async (req, res, next) => {
    let avatarData = {
        public_id: "",
        url: "",
    };
    let resumeData = { public_id: "", url: "" };

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

    const cleanEmail = String(email || "").toLowerCase().trim();

    // 1. Verify email uniqueness against MongoDB (if live)
    if (isDbConnected()) {
        try {
            const existingUser = await User.findOne({ email: cleanEmail });
            if (existingUser) {
                return next(new ErrorHandler("User already exists with this email address! Please sign in instead.", 400));
            }
        } catch (dbErr) {
            console.warn("MongoDB check error:", dbErr.message);
        }
    }

    // 2. Verify email uniqueness against persistent DataStore
    if (DataStore.userExists && DataStore.userExists(cleanEmail)) {
        return next(new ErrorHandler("User already exists with this email address! Please sign in instead.", 400));
    }

    // 3. Register user in MongoDB if live
    if (isDbConnected()) {
        try {
            const user = await User.create({
                fullName: fullName || "Portfolio Owner",
                email: cleanEmail,
                phone: phone || "",
                role: role || "",
                location: location || "",
                aboutMe: aboutMe || "",
                password,
                portfolioURL: portfolioURL || "",
                githubURL: githubURL || "",
                instagramURL: instagramURL || "",
                facebookURL: facebookURL || "",
                twitterURL: twitterURL || "",
                linkedInURL: linkedInURL || "",
                avatar: avatarData,
                resume: resumeData,
            });

            // Keep DataStore in sync for fallback
            try {
                DataStore.registerAdminUser({
                    _id: String(user._id),
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    aboutMe: user.aboutMe,
                    password,
                    role: user.role,
                    location: user.location,
                    avatar: avatarData,
                    resume: resumeData,
                    portfolioURL: user.portfolioURL,
                    githubURL: user.githubURL,
                    instagramURL: user.instagramURL,
                    facebookURL: user.facebookURL,
                    twitterURL: user.twitterURL,
                    linkedInURL: user.linkedInURL,
                });
            } catch (syncErr) {
                console.warn("DataStore sync warning during mongo register:", syncErr.message);
            }

            return generateJwtToken(user, "Admin Account Created Successfully!", 201, res);
        } catch (dbErr) {
            if (dbErr.code === 11000) {
                return next(new ErrorHandler("User already exists with this email address! Please sign in instead.", 400));
            }
            console.warn("MongoDB register warning, using DataStore:", dbErr.message);
        }
    }

    // 4. Register in persistent DataStore
    try {
        const registeredStoreAdmin = DataStore.registerAdminUser({
            fullName: fullName || "Admin",
            email: cleanEmail,
            phone: phone || "",
            aboutMe: aboutMe || "",
            password,
            role: role || "",
            location: location || "",
            avatar: avatarData,
            resume: resumeData,
            portfolioURL: portfolioURL || "",
            githubURL: githubURL || "",
            instagramURL: instagramURL || "",
            facebookURL: facebookURL || "",
            twitterURL: twitterURL || "",
            linkedInURL: linkedInURL || "",
        });

        return generateJwtToken(registeredStoreAdmin, "Admin Account Created Successfully!", 201, res);
    } catch (storeErr) {
        return next(new ErrorHandler(storeErr.message || "User already exists with this email address! Please sign in instead.", 400));
    }
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

    const cleanEmail = String(email).toLowerCase().trim();

    // 1. Check MongoDB if database connection is live
    if (isDbConnected()) {
        try {
            const user = await User.findOne({ email: cleanEmail }).select("+password");
            if (user) {
                const isPasswordMatched = await user.comparePassword(password);
                if (isPasswordMatched) {
                    DataStore.updateUser({
                        _id: user._id,
                        fullName: user.fullName || "Portfolio Owner",
                        email: user.email,
                        phone: user.phone || "",
                        role: user.role || "",
                        location: user.location || "",
                        aboutMe: user.aboutMe || "",
                        avatar: user.avatar || { public_id: "", url: "" },
                        resume: user.resume || { public_id: "", url: "" },
                        portfolioURL: user.portfolioURL || "",
                        githubURL: user.githubURL || "",
                        twitterURL: user.twitterURL || "",
                        linkedInURL: user.linkedInURL || "",
                    });
                    return generateJwtToken(user, "Welcome back!", 200, res);
                }
                return next(new ErrorHandler("Incorrect password. Please try again.", 401));
            }
        } catch (dbErr) {
            console.warn("MongoDB login check failed, falling back to local store:", dbErr.message);
        }
    }

    // 2. Check DataStore Admin Registry
    const storeAdmin = DataStore.findAdminUser(cleanEmail);
    if (storeAdmin) {
        const isMatched = storeAdmin.password === password;

        if (!isMatched) {
            return next(new ErrorHandler("Incorrect password. Please try again.", 401));
        }

        const tokenPayload = {
            _id: storeAdmin._id || ("user-" + Date.now()),
            email: storeAdmin.email,
            fullName: storeAdmin.fullName || "Portfolio Owner",
            phone: storeAdmin.phone || "",
            role: storeAdmin.role || "",
            location: storeAdmin.location || "",
            aboutMe: storeAdmin.aboutMe || "",
            avatar: storeAdmin.avatar || { public_id: "", url: "" },
            resume: storeAdmin.resume || { public_id: "", url: "" },
        };

        // Sync active portfolio user so client portfolio immediately reflects the logged-in admin
        DataStore.updateUser(tokenPayload);

        // If MongoDB is connected and user is missing in Mongo, sync to DB
        if (isDbConnected()) {
            User.create({
                fullName: storeAdmin.fullName || "Portfolio Owner",
                email: cleanEmail,
                phone: storeAdmin.phone || "",
                password: password,
            }).catch(() => {});
        }

        return generateJwtToken(tokenPayload, "Welcome back!", 200, res);
    }

    return next(new ErrorHandler("No account found with this email. Please sign up first.", 404));
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
    DataStore.clearActiveUser();
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

/**
 * Get profile for authenticated user
 */
export const myProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;

    if (isDbConnected()) {
        let userProfileDetails = null;
        if (userId && mongoose.isValidObjectId(userId)) {
            userProfileDetails = await User.findById(userId);
        }
        if (!userProfileDetails && userEmail) {
            userProfileDetails = await User.findOne({ email: String(userEmail).toLowerCase().trim() });
        }
        if (!userProfileDetails && userId) {
            userProfileDetails = await User.findById(userId);
        }

        if (userProfileDetails) {
            return res.status(200).json({
                success: true,
                userProfileDetails,
                user: userProfileDetails,
            });
        }
    }

    // Resolve user from DataStore based on authenticated user credentials
    let userProfileDetails = null;
    if (userEmail) {
        userProfileDetails = DataStore.findAdminUser(userEmail);
    }
    if (!userProfileDetails && userId) {
        userProfileDetails = DataStore.getUserById(userId);
    }
    if (!userProfileDetails && req.user) {
        userProfileDetails = req.user;
    }
    if (!userProfileDetails) {
        userProfileDetails = DataStore.getUser();
    }

    res.status(200).json({
        success: true,
        userProfileDetails,
        user: userProfileDetails,
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

    if (req.body.services !== undefined) {
        try {
            let parsed = typeof req.body.services === "string" ? JSON.parse(req.body.services) : req.body.services;
            if (Array.isArray(parsed)) {
                for (let i = 0; i < parsed.length; i++) {
                    const fileKey = `service_image_${i}`;
                    if (req.files && req.files[fileKey]) {
                        const uploadRes = await processUploadedFile(req.files[fileKey], "services");
                        if (uploadRes && uploadRes.url) {
                            parsed[i].imageSrc = uploadRes.url;
                        }
                    }
                }
                newUserData.services = parsed;
            } else {
                newUserData.services = [];
            }
        } catch {
            newUserData.services = [];
        }
    }

    Object.keys(newUserData).forEach(
        (key) => newUserData[key] === undefined && delete newUserData[key]
    );

    // Avatar handling: Uploaded file > Explicit removal / clear > Valid URL string
    const isRemovingAvatar =
        req.body.removeAvatar === "true" ||
        req.body.removeAvatar === true ||
        req.body.avatarAction === "remove" ||
        (req.body.avatarUrl === "" && !req.files?.avatar);

    if (req.files && req.files.avatar) {
        const avatarResult = await processUploadedFile(req.files.avatar, "avatar");
        if (avatarResult) {
            newUserData.avatar = avatarResult;
        }
    } else if (isRemovingAvatar) {
        newUserData.avatar = {
            public_id: "",
            url: "",
        };
    } else if (req.body.avatarUrl && typeof req.body.avatarUrl === "string" && req.body.avatarUrl.trim() !== "") {
        newUserData.avatar = {
            public_id: "avatar_" + Date.now(),
            url: req.body.avatarUrl.trim(),
        };
    }

    // Resume handling: Uploaded file > Explicit removal / clear > Valid URL string
    const isRemovingResume =
        req.body.removeResume === "true" ||
        req.body.removeResume === true ||
        req.body.resumeAction === "remove" ||
        (req.body.resumeUrl === "" && !req.files?.resume);

    if (req.files && req.files.resume) {
        const resumeResult = await processUploadedFile(req.files.resume, "resume");
        if (resumeResult) {
            newUserData.resume = resumeResult;
        }
    } else if (isRemovingResume) {
        newUserData.resume = {
            public_id: "",
            url: "",
        };
    } else if (req.body.resumeUrl && typeof req.body.resumeUrl === "string" && req.body.resumeUrl.trim() !== "") {
        newUserData.resume = {
            public_id: "resume_" + Date.now(),
            url: req.body.resumeUrl.trim(),
        };
    }

    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email || req.body.email;

    if (isDbConnected()) {
        let user = null;
        if (userId && mongoose.isValidObjectId(userId)) {
            user = await User.findByIdAndUpdate(userId, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
        }
        if (!user && userEmail) {
            user = await User.findOneAndUpdate(
                { email: String(userEmail).toLowerCase().trim() },
                newUserData,
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }
        if (!user && (userId || userEmail)) {
            user = await User.create({
                ...newUserData,
                ...(userId && mongoose.isValidObjectId(userId) ? { _id: userId } : {}),
                ...(userEmail ? { email: userEmail } : {}),
            });
        }
        if (user) {
            DataStore.updateUser({ ...newUserData, _id: user._id, email: user.email });
            return res.status(200).json({
                success: true,
                message: "Profile Updated!",
                user,
                userProfileDetails: user,
            });
        }
    }

    const user = DataStore.updateUser({ ...newUserData, _id: userId, email: userEmail });
    res.status(200).json({
        success: true,
        message: "Profile Updated!",
        user,
        userProfileDetails: user,
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
 * Get user profile details for portfolio client application (supports /profile/portfolio and /portfolio/:username)
 */
export const getUserPortfolioDetails = catchAsyncErrors(async (req, res, next) => {
    const username = req.params.username || req.query.username;

    if (isDbConnected()) {
        let user = null;
        if (username) {
            const cleanUser = String(username).toLowerCase().trim();
            user = await User.findOne({
                $or: [
                    { email: cleanUser },
                    { email: new RegExp(`^${cleanUser}@`, "i") },
                    { fullName: new RegExp(`^${cleanUser}$`, "i") },
                ],
            });
            if (!user && mongoose.isValidObjectId(cleanUser)) {
                user = await User.findById(cleanUser);
            }
        }

        if (!user) {
            const authHeader = req.headers.authorization;
            const cookieToken = req.cookies?.token;
            const token = (authHeader && authHeader.startsWith("Bearer "))
                ? authHeader.split(" ")[1]
                : cookieToken;

            if (token && token !== "demo_admin_jwt_token_2026") {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "portfolio_dev_secret_key_2026");
                    const uid = decoded?.id || decoded?._id;
                    if (uid && mongoose.isValidObjectId(uid)) {
                        user = await User.findById(uid);
                    }
                } catch (_) {
                    // Token invalid or expired
                }
            }
        }

        // If no username specified and no authenticated session, return empty user (null)
        return res.status(200).json({
            success: true,
            user: user || null,
        });
    }

    if (username) {
        const userByUsername = DataStore.getUserByUsername ? DataStore.getUserByUsername(username) : null;
        if (userByUsername) {
            return res.status(200).json({
                success: true,
                user: userByUsername,
            });
        }
    }

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;
    const token = (authHeader && authHeader.startsWith("Bearer ")) ? authHeader.split(" ")[1] : cookieToken;
    let fallbackUser = null;
    if (token && token !== "demo_admin_jwt_token_2026") {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "portfolio_dev_secret_key_2026");
            const uid = decoded?.id || decoded?._id;
            if (uid) {
                fallbackUser = DataStore.getUserById(uid);
            }
            if (!fallbackUser && decoded && decoded.email) {
                fallbackUser = DataStore.findAdminUser(decoded.email);
            }
        } catch (_) {
            // Token invalid or expired
        }
    }

    res.status(200).json({
        success: true,
        user: fallbackUser || null,
    });
});

export const forgotPassword = sendPhoneOtp;
export const resetPassword = verifyOtpAndResetPassword;
