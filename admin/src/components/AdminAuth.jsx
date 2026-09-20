import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { loginSuccess, setToast, toggleThemeMode } from "../redux/store";
import {
  adminLogin,
  adminRegister,
  sendMobileOtp,
  verifyOtpAndResetPassword,
} from "../api/adminApi";
import {
  Lock,
  Mail,
  Smartphone,
  KeyRound,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Code2,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

/**
 * AdminAuth Portal
 * Handles:
 * 1. Admin Sign In
 * 2. Create Admin Credentials (Register)
 * 3. Mobile Number OTP Forgot Password
 * 4. Verify OTP & Reset Password
 *
 * Implements high-contrast dynamic styling for Light & Dark mode,
 * vanishing placeholders on input focus, and test admin account autofill.
 */
const AdminAuth = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth?.themeMode || "dark");
  const isDark = themeMode === "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  // Mode: "login" | "register" | "forgot" | "reset"
  const [mode, setMode] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      if (urlMode && ["login", "register", "forgot", "reset"].includes(urlMode)) {
        return urlMode;
      }
      if (window.location.pathname.includes("register")) return "register";
    } catch (e) {
      // fallback
    }
    return "login";
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Form Fields - Default empty so placeholders display
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  // Vanishing placeholder on focus
  const handleFocus = (e) => {
    e.target.dataset.originalPlaceholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    if (!e.target.value && e.target.dataset.originalPlaceholder) {
      e.target.placeholder = e.target.dataset.originalPlaceholder;
    }
  };

  // Fill default test credentials
  const fillTestCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: "admin@gmail.com",
      password: "admin123",
    }));
    setErrorMsg("");
  };

  // 1. Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await adminLogin(formData.email, formData.password);
      dispatch(
        loginSuccess({
          token: res.token || "admin_jwt_token_active",
          user: res.user || {
            fullName: "Admin",
            email: formData.email,
            phone: "",
            role: "Administrator",
          },
        })
      );
      dispatch(setToast({ type: "success", message: "Welcome to Admin Studio!" }));
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Register (Create Admin)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Email and password are required.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await adminRegister({
        fullName: formData.fullName || "Admin",
        email: formData.email,
        phone: formData.phone || "",
        password: formData.password,
      });
      dispatch(
        loginSuccess({
          token: res.token || "admin_jwt_token_active",
          user: res.user || {
            fullName: formData.fullName || "Admin",
            email: formData.email,
            phone: formData.phone || "",
            role: "Administrator",
          },
        })
      );
      dispatch(setToast({ type: "success", message: "Admin credentials established!" }));
    } catch (err) {
      setErrorMsg(err.message || "Failed to create admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Send Mobile OTP for Forgot Password
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setErrorMsg("Please enter your registered mobile number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await sendMobileOtp(formData.phone);
      setInfoMsg(`OTP dispatched to ${formData.phone}. Use code: ${res.otpCode || "123456"}`);
      if (res.otpCode) {
        setFormData((prev) => ({ ...prev, otp: res.otpCode }));
      }
      setMode("reset");
    } catch (err) {
      setErrorMsg(err.message || "Failed to send OTP to mobile number.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp || !formData.password || !formData.confirmPassword) {
      setErrorMsg("Please complete all verification fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await verifyOtpAndResetPassword({
        phone: formData.phone,
        otp: formData.otp,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      dispatch(
        setToast({
          type: "success",
          message: "Password reset successful! Sign in with your new credentials.",
        })
      );
      setMode("login");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "", otp: "" }));
    } catch (err) {
      setErrorMsg(err.message || "Failed to reset password. Verify your OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Theme styling palette
  const themeStyles = {
    pageBg: isDark ? "#090d16" : "#f1f5f9",
    cardBg: isDark ? "#141824" : "#ffffff",
    cardBorder: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
    cardShadow: isDark
      ? "20px 20px 60px #080a10, -10px -10px 40px #1a2030"
      : "0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
    bannerBorder: isDark ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid #f1f5f9",
    headingColor: isDark ? "#ffffff" : "#0f172a",
    subheadingColor: isDark ? "#94a3b8" : "#475569",
    labelColor: isDark ? "#cbd5e1" : "#1e293b",
    inputBg: isDark ? "rgba(15, 18, 28, 0.85)" : "#f8fafc",
    inputBorder: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
    inputColor: isDark ? "#ffffff" : "#0f172a",
    inputFocusBorder: isDark ? "rgba(99, 102, 241, 0.8)" : "#4f46e5",
    iconColor: isDark ? "#64748b" : "#64748b",
    footerText: isDark ? "#94a3b8" : "#64748b",
    accentLink: isDark ? "#818cf8" : "#4f46e5",
    themeButtonBg: isDark ? "#1e293b" : "#ffffff",
    themeButtonBorder: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
    themeButtonText: isDark ? "#f8fafc" : "#1e293b",
    pillBg: isDark ? "rgba(99, 102, 241, 0.15)" : "#e0e7ff",
    pillBorder: isDark ? "rgba(99, 102, 241, 0.3)" : "#c7d2fe",
    pillText: isDark ? "#a5b4fc" : "#4338ca",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: themeStyles.pageBg,
        position: "relative",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* Theme Switcher Button at Top Right */}
      <button
        type="button"
        onClick={() => dispatch(toggleThemeMode())}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 12,
          background: themeStyles.themeButtonBg,
          border: themeStyles.themeButtonBorder,
          color: themeStyles.themeButtonText,
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: isDark
            ? "4px 4px 10px #06080d, -4px -4px 10px #1a2233"
            : "0 2px 6px rgba(0,0,0,0.06)",
          transition: "all 0.2s ease",
        }}
        title="Toggle Light / Dark Mode"
      >
        {isDark ? (
          <>
            <Sun size={16} color="#fbbf24" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={16} color="#4f46e5" />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "22px",
          background: themeStyles.cardBg,
          border: themeStyles.cardBorder,
          boxShadow: themeStyles.cardShadow,
          overflow: "hidden",
          transition: "background-color 0.25s ease, border 0.25s ease",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            padding: "32px 32px 22px 32px",
            textAlign: "center",
            borderBottom: themeStyles.bannerBorder,
            background: isDark
              ? "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)"
              : "linear-gradient(180deg, rgba(79, 70, 229, 0.04) 0%, transparent 100%)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              margin: "0 auto 14px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 18px rgba(99, 102, 241, 0.35)",
              color: "#ffffff",
            }}
          >
            <Code2 size={28} />
          </div>
          <h1
            style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: themeStyles.headingColor,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            MakeYourCV Studio
          </h1>
          <p
            style={{
              fontSize: "0.86rem",
              color: themeStyles.subheadingColor,
              marginTop: "6px",
              marginBottom: 0,
              lineHeight: 1.4,
            }}
          >
            {mode === "login" && "Sign in to manage your resumes & portfolio"}
            {mode === "register" && "Create your free MakeYourCV account in seconds"}
            {mode === "forgot" && "Reset your password via Mobile Number OTP"}
            {mode === "reset" && "Verify OTP code and create new password"}
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: "28px 32px" }}>
          {/* Notifications Alert Banner */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
                  border: isDark ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid #fca5a5",
                  color: isDark ? "#fca5a5" : "#b91c1c",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginBottom: "18px",
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {infoMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
                  border: isDark ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid #6ee7b7",
                  color: isDark ? "#6ee7b7" : "#047857",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginBottom: "18px",
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{infoMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin}>
              {/* Quick Fill Test Admin Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: themeStyles.pillBg,
                  border: `1px solid ${themeStyles.pillBorder}`,
                  color: themeStyles.pillText,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={14} />
                  <span>Test Admin: admin@gmail.com</span>
                </div>
                <button
                  type="button"
                  onClick={fillTestCredentials}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    textDecoration: "underline",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Fill
                </button>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="admin-login-email"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="admin@gmail.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease, background 0.2s ease",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label
                    htmlFor="admin-login-password"
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: themeStyles.labelColor,
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setInfoMsg("");
                      setMode("forgot");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: themeStyles.accentLink,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 42px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease, background 0.2s ease",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                      background: "none",
                      border: "none",
                      color: themeStyles.iconColor,
                      cursor: "pointer",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{loading ? "Authenticating..." : "Sign In to Studio"}</span>
                <ArrowRight size={18} />
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: "0.85rem",
                  color: themeStyles.footerText,
                }}
              >
                Need to create admin account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setInfoMsg("");
                    setMode("register");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeStyles.accentLink,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Create Admin
                </button>
              </div>
            </form>
          )}

          {/* VIEW: REGISTER (CREATE CREDENTIALS) */}
          {mode === "register" && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="admin-reg-fullname"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reg-fullname"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. Admin User"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="admin-reg-email"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reg-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. admin@gmail.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="admin-reg-phone"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Mobile Number (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <Smartphone
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reg-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. +91 9876543210"
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div>
                  <label
                    htmlFor="admin-reg-pass"
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: themeStyles.labelColor,
                      marginBottom: 6,
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="admin-reg-pass"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-reg-confpass"
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: themeStyles.labelColor,
                      marginBottom: 6,
                    }}
                  >
                    Confirm
                  </label>
                  <input
                    id="admin-reg-confpass"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                }}
              >
                <span>{loading ? "Creating Account..." : "Create Admin Credentials"}</span>
                <ShieldCheck size={18} />
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 18,
                  fontSize: "0.85rem",
                  color: themeStyles.footerText,
                }}
              >
                Already have credentials?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setInfoMsg("");
                    setMode("login");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeStyles.accentLink,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD (REQUEST OTP) */}
          {mode === "forgot" && (
            <form onSubmit={handleSendOtp}>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: themeStyles.subheadingColor,
                  lineHeight: 1.5,
                  marginBottom: 18,
                }}
              >
                Enter your registered mobile phone number. We will dispatch a 6-digit verification code to verify your identity.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="admin-forgot-phone"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Registered Mobile Number
                </label>
                <div style={{ position: "relative" }}>
                  <Smartphone
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-forgot-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="e.g. +91 9876543210"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 15px rgba(245, 158, 11, 0.35)",
                }}
              >
                <span>{loading ? "Sending OTP..." : "Send Verification OTP"}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: "center", marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setInfoMsg("");
                    setMode("login");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeStyles.footerText,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW: VERIFY OTP & RESET PASSWORD */}
          {mode === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="admin-reset-otp"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Enter 6-Digit OTP
                </label>
                <div style={{ position: "relative" }}>
                  <KeyRound
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reset-otp"
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="123456"
                    maxLength={6}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "1rem",
                      fontWeight: 700,
                      letterSpacing: "4px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="admin-reset-newpass"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reset-newpass"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label
                  htmlFor="admin-reset-confpass"
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: themeStyles.labelColor,
                    marginBottom: 6,
                  }}
                >
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={18}
                    style={{ position: "absolute", left: 14, top: 12, color: themeStyles.iconColor }}
                  />
                  <input
                    id="admin-reset-confpass"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: themeStyles.inputBg,
                      border: themeStyles.inputBorder,
                      borderRadius: "12px",
                      color: themeStyles.inputColor,
                      fontSize: "0.92rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
                }}
              >
                <span>{loading ? "Resetting Password..." : "Verify OTP & Reset"}</span>
                <CheckCircle2 size={18} />
              </button>

              <div style={{ textAlign: "center", marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setInfoMsg("");
                    setMode("forgot");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeStyles.footerText,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
