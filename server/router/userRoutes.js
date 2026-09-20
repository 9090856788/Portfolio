import express from "express";
import {
    register,
    login,
    logout,
    myProfile,
    updateProfile,
    updatePassword,
    getUserPortfolioDetails,
    sendPhoneOtp,
    verifyOtpAndResetPassword,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Admin Account & Authentication
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, myProfile);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);

// Public Portfolio Profile
router.get("/profile/portfolio", getUserPortfolioDetails);
router.get("/portfolio/:username", getUserPortfolioDetails);

// Mobile OTP-based Password Reset & Forgot Password
router.post("/password/forgot", sendPhoneOtp);
router.post("/password/reset", verifyOtpAndResetPassword);
router.post("/otp/send", sendPhoneOtp);
router.post("/otp/verify-reset", verifyOtpAndResetPassword);

export default router;
