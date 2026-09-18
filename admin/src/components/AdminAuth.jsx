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
} from "lucide-react";

/**
 * AdminAuthModal / Portal
 * Handles:
 * 1. Admin Sign In
 * 2. Create Admin Credentials (Register)
 * 3. Mobile Number OTP Forgot Password
 * 4. Verify OTP & Reset Password
 */
const AdminAuth = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth?.themeMode || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  // Mode: "login" | "register" | "forgot" | "reset"
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "Kanhu Charan Sahoo",
    email: "kanhucharansahoo595@gmail.com",
    phone: "+91 9090856788",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          token: res.token || "demo_admin_jwt_token_2026",
          user: res.user || {
            fullName: "Kanhu Charan Sahoo",
            email: formData.email,
            phone: "+91 9090856788",
            role: "Frontend Developer",
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
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      dispatch(
        loginSuccess({
          token: res.token || "demo_admin_jwt_token_2026",
          user: res.user || {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
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
      setInfoMsg(`OTP dispatched to ${formData.phone}. Use code: ${res.otpCode || "Check SMS"}`);
      // Auto-populate for seamless local testing
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
        confirmNewPassword: formData.confirmPassword,
      });
      setInfoMsg("Password reset successfully! Please sign in with your new password.");
      setMode("login");
    } catch (err) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-theme={themeMode}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "var(--admin-bg)",
        position: "relative",
      }}
    >
      {/* Theme Switcher in Top Right */}
      <button
        onClick={() => dispatch(toggleThemeMode())}
        className="btn-neumorph"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          padding: "8px 14px",
          gap: 8,
          fontSize: "0.85rem",
          fontWeight: 600,
        }}
        title="Toggle Theme"
      >
        {themeMode === "dark" ? (
          <>
            <Sun size={16} color="#fbbf24" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={16} color="#6366f1" />
            <span>Dark</span>
          </>
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="neumorph-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "24px",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {/* Top Brand Banner */}
        <div
          style={{
            padding: "32px 32px 24px 32px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            background: "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              margin: "0 auto 16px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
              color: "#ffffff",
            }}
          >
            <Code2 size={28} />
          </div>
          <h1
            style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Portfolio Admin Studio
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginTop: "4px",
            }}
          >
            {mode === "login" && "Sign in to manage portfolio content & inquiries"}
            {mode === "register" && "Create your personal administrator account"}
            {mode === "forgot" && "Reset your password via Mobile Number OTP"}
            {mode === "reset" && "Verify OTP code and create new password"}
          </p>
        </div>

        {/* Form Container */}
        <div style={{ padding: "28px 32px" }}>
          {/* Error / Alert notification banner */}
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
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#fca5a5",
                  fontSize: "0.85rem",
                  marginBottom: "18px",
                }}
              >
                <AlertCircle size={16} />
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
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#6ee7b7",
                  fontSize: "0.85rem",
                  marginBottom: "18px",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{infoMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW: LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kanhu@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1" }}>
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
                      color: "#818cf8",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 42px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
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
                      color: "#64748b",
                      cursor: "pointer",
                    }}
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
                }}
              >
                <span>{loading ? "Authenticating..." : "Sign In to Studio"}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.85rem", color: "#94a3b8" }}>
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
                    color: "#818cf8",
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
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Kanhu Charan Sahoo"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kanhu@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Mobile Number (For OTP Verification)
                </label>
                <div style={{ position: "relative" }}>
                  <Smartphone size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9090856788"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                    Confirm
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
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
                }}
              >
                <span>{loading ? "Creating Account..." : "Create Admin Credentials"}</span>
                <ShieldCheck size={18} />
              </button>

              <div style={{ textAlign: "center", marginTop: 18, fontSize: "0.85rem", color: "#94a3b8" }}>
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
                    color: "#818cf8",
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
              <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: 18 }}>
                Enter your registered mobile phone number. We will dispatch a 6-digit verification code to verify your identity.
              </p>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Registered Mobile Number
                </label>
                <div style={{ position: "relative" }}>
                  <Smartphone size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9090856788"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
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
                    color: "#94a3b8",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.85rem",
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
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Enter 6-Digit OTP
                </label>
                <div style={{ position: "relative" }}>
                  <KeyRound size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="123456"
                    maxLength={6}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: 600,
                      letterSpacing: "4px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 42px",
                      background: "rgba(15, 18, 28, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
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
                    color: "#94a3b8",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.85rem",
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
