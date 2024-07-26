import express from "express";
import {
    forgotPassword,
    getUserPortfolioDetails,
    login,
    logout,
    myProfile,
    register,
    resetPassword,
    updatePassword,
    updateProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, myProfile);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.get("/profile/portfolio", getUserPortfolioDetails);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:token", resetPassword);

export default router;
