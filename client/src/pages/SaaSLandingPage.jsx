/* eslint-disable react/prop-types, no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Zap,
  Share2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Sun,
  Moon,
  Star,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Code2,
  Palette,
  Check,
  Copy,
  Download,
  Eye,
  Sliders,
  Smartphone,
  Laptop,
  GraduationCap,
  FolderGit2,
} from "lucide-react";

export default function SaaSLandingPage({ toggleDarkMode, isDarkMode: externalDarkMode }) {
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [activeTab, setActiveTab] = useState("personal");
  const [faqOpen, setFaqOpen] = useState({ 0: true });
  const [copiedLink, setCopiedLink] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [atsScoreExpanded, setAtsScoreExpanded] = useState(false);

  // Fallback dark mode check
  const isDark =
    externalDarkMode !== undefined
      ? externalDarkMode
      : document.documentElement.getAttribute("data-theme") !== "light";

  // Neumorphic design token generator based on current theme
  const neu = {
    bg: isDark ? "#0c101b" : "#e6ebf4",
    bgPage: isDark
      ? "radial-gradient(ellipse 80% 50% at 50% -15%, rgba(99, 102, 241, 0.16), #0c101b 80%)"
      : "radial-gradient(ellipse 80% 50% at 50% -15%, rgba(99, 102, 241, 0.1), #e6ebf4 80%)",
    headerBg: isDark ? "rgba(12, 16, 27, 0.86)" : "rgba(230, 235, 244, 0.88)",
    cardBg: isDark ? "#121726" : "#eef3f9",
    cardBorder: isDark ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(255, 255, 255, 0.9)",
    cardShadow: isDark
      ? "8px 8px 24px rgba(0, 0, 0, 0.65), -6px -6px 20px rgba(45, 55, 88, 0.22)"
      : "8px 8px 20px rgba(166, 180, 200, 0.58), -8px -8px 20px rgba(255, 255, 255, 0.95)",
    cardShadowSm: isDark
      ? "4px 4px 12px rgba(0, 0, 0, 0.5), -3px -3px 10px rgba(45, 55, 88, 0.16)"
      : "4px 4px 10px rgba(166, 180, 200, 0.45), -4px -4px 10px rgba(255, 255, 255, 0.9)",
    cardShadowHover: isDark
      ? "11px 11px 30px rgba(0, 0, 0, 0.78), -8px -8px 24px rgba(55, 68, 108, 0.28)"
      : "11px 11px 26px rgba(166, 180, 200, 0.75), -10px -10px 24px rgba(255, 255, 255, 1)",
    insetBg: isDark ? "#090d16" : "#e1e7f0",
    insetShadow: isDark
      ? "inset 4px 4px 9px rgba(0, 0, 0, 0.75), inset -3px -3px 7px rgba(45, 55, 88, 0.16)"
      : "inset 3px 3px 7px rgba(166, 180, 200, 0.55), inset -3px -3px 7px rgba(255, 255, 255, 0.9)",
    insetShadowSm: isDark
      ? "inset 2px 2px 5px rgba(0, 0, 0, 0.65), inset -2px -2px 4px rgba(45, 55, 88, 0.12)"
      : "inset 2px 2px 4px rgba(166, 180, 200, 0.45), inset -2px -2px 4px rgba(255, 255, 255, 0.85)",
    insetBorder: isDark ? "1px solid rgba(255, 255, 255, 0.04)" : "1px solid rgba(166, 180, 200, 0.25)",
    textPrimary: isDark ? "#f8fafc" : "#1e293b",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    textMuted: isDark ? "#64748b" : "#8e9cae",
    accent: "#6366f1",
    accentGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  };

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      tag: "Popular",
      desc: "Clean contemporary layout with crisp typography and subtle header accents.",
      accent: "#6366f1",
    },
    {
      id: "minimal",
      name: "Minimal ATS",
      tag: "ATS-Ready",
      desc: "Simple, single-column and pristine, optimized for all scanner parsers.",
      accent: "#0ea5e9",
    },
    {
      id: "executive",
      name: "Executive",
      tag: "Leadership",
      desc: "Bold layout with authority framing for senior directors, leads and managers.",
      accent: "#f59e0b",
    },
    {
      id: "developer",
      name: "Technical Developer",
      tag: "Tech Favorite",
      desc: "Tech-stack first layout highlighting GitHub, repositories, and frameworks.",
      accent: "#10b981",
    },
    {
      id: "creative",
      name: "Creative & Design",
      tag: "Visual",
      desc: "Distinctive two-column grid with color accents and visual hierarchy.",
      accent: "#ec4899",
    },
  ];

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyDemoLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://portfolio.dev";
    navigator.clipboard.writeText(`${origin}/portfolio`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  const floatAnimation = {
    animate: {
      y: [0, -6, 0],
      transition: {
        repeat: Infinity,
        duration: 3.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: neu.bgPage,
        backgroundColor: neu.bg,
        color: neu.textPrimary,
        fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: "hidden",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR (Neumorphic Sticky Bar)
      ───────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(18px)",
          background: neu.headerBg,
          borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(166, 180, 200, 0.3)",
          boxShadow: isDark
            ? "0 4px 20px rgba(0, 0, 0, 0.35)"
            : "0 4px 16px rgba(166, 180, 200, 0.35)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo with Neumorphic raised icon */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: neu.accentGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: isDark
                  ? "0 6px 18px rgba(99, 102, 241, 0.45), inset 1px 1px 2px rgba(255, 255, 255, 0.4)"
                  : "0 6px 16px rgba(99, 102, 241, 0.35), inset 1px 1px 2px rgba(255, 255, 255, 0.5)",
              }}
            >
              <FileText size={22} strokeWidth={2.4} />
            </motion.div>
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                background: isDark
                  ? "linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Portfolio Studio
            </span>
          </Link>

          {/* Center Links (Inset Pill Capsule) */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: 6,
              fontSize: "0.9rem",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: 999,
              background: neu.insetBg,
              boxShadow: neu.insetShadowSm,
              border: neu.insetBorder,
            }}
            className="desktop-nav"
          >
            {[
              { label: "Home", href: "#hero" },
              { label: "Features", href: "#features" },
              { label: "Templates", href: "#templates" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ y: -1 }}
                style={{
                  color: neu.textSecondary,
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: 999,
                  transition: "color 0.2s ease, background 0.2s ease",
                }}
              >
                {link.label}
              </motion.a>
            ))}
            <Link
              to="/portfolio"
              style={{
                color: "#6366f1",
                fontWeight: 700,
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              Portfolio
            </Link>
          </nav>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Neumorphic Theme Toggle */}
            {toggleDarkMode && (
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
                style={{
                  background: neu.cardBg,
                  border: neu.cardBorder,
                  borderRadius: 12,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: isDark ? "#f59e0b" : "#4f46e5",
                  boxShadow: neu.cardShadowSm,
                  transition: "all 0.2s ease",
                }}
              >
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun size={19} /> : <Moon size={19} />}
                </motion.div>
              </motion.button>
            )}

            {/* Sign In (Neumorphic Soft Button) */}
            <motion.a
              href="/admin/?mode=login"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: neu.textPrimary,
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 12,
                background: neu.cardBg,
                border: neu.cardBorder,
                boxShadow: neu.cardShadowSm,
                display: "inline-flex",
                alignItems: "center",
                transition: "all 0.2s ease",
              }}
            >
              Sign In
            </motion.a>

            {/* Get Started (Neumorphic Extruded Accent Button) */}
            <motion.a
              href="/admin/?mode=register"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                background: neu.accentGradient,
                color: "#ffffff",
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 12,
                boxShadow: isDark
                  ? "0 6px 20px rgba(99, 102, 241, 0.45)"
                  : "0 6px 18px rgba(79, 70, 229, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              Get Started <ArrowRight size={16} />
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Neumorphic Depth & Spring Motion)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "56px 24px 76px",
          textAlign: "center",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 940, margin: "0 auto" }}
        >
          {/* Floating Neumorphic Eyebrow Badge */}
          <motion.div variants={itemVariants}>
            <motion.div
              {...floatAnimation}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                background: neu.cardBg,
                boxShadow: neu.cardShadowSm,
                border: neu.cardBorder,
                color: isDark ? "#a5b4fc" : "#4f46e5",
                fontSize: "0.86rem",
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              <Sparkles size={16} color="#6366f1" />
              <span>Neumorphic Studio • ATS-Optimized • Multi-Template</span>
            </motion.div>
          </motion.div>

          {/* Hero Title with Display Typography */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "clamp(2.5rem, 5.8vw, 4.4rem)",
              fontWeight: 850,
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
              margin: "0 auto 20px",
            }}
          >
            Create Your Resume.{" "}
            <span
              style={{
                background: isDark
                  ? "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get Hired.
            </span>
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
              lineHeight: 1.6,
              color: neu.textSecondary,
              maxWidth: 720,
              margin: "0 auto 34px",
            }}
          >
            Build, customize, and download professional resumes and portfolios tailored to your career and job
            requirements. Tactile precision. ATS-friendly architecture.
          </motion.p>

          {/* Hero Action Buttons (Tactile Neumorphic Buttons) */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 38,
            }}
          >
            <motion.a
              href="/admin/?mode=register"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96, y: 1 }}
              style={{
                background: neu.accentGradient,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "14px 32px",
                borderRadius: 14,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: isDark
                  ? "0 10px 28px rgba(99, 102, 241, 0.45), 4px 4px 14px rgba(0, 0, 0, 0.4)"
                  : "0 10px 24px rgba(79, 70, 229, 0.4), 4px 4px 12px rgba(166, 180, 200, 0.5)",
              }}
            >
              Create Your Customized CV <ArrowRight size={18} />
            </motion.a>

            <motion.button
              onClick={() => setDemoModalOpen(true)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96, y: 1 }}
              style={{
                background: neu.cardBg,
                color: neu.textPrimary,
                border: neu.cardBorder,
                boxShadow: neu.cardShadow,
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "14px 28px",
                borderRadius: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: neu.insetBg,
                  boxShadow: neu.insetShadowSm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={12} fill="currentColor" color="#6366f1" />
              </div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Social Proof Pill (Neumorphic Inset Capsule) */}
          <motion.div
            variants={itemVariants}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "10px 22px",
              borderRadius: 999,
              background: neu.insetBg,
              boxShadow: neu.insetShadowSm,
              border: neu.insetBorder,
              marginBottom: 52,
            }}
          >
            <div style={{ display: "flex", marginLeft: 8 }}>
              {["👨‍💻", "👩‍💼", "👨‍🎨"].map((emoji, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: neu.cardBg,
                    boxShadow: neu.cardShadowSm,
                    border: neu.cardBorder,
                    marginLeft: -10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: neu.textPrimary }}>
                Thousands of professionals already using Portfolio Studio
              </div>
              <div style={{ display: "flex", gap: 3, color: "#f59e0b", fontSize: "0.8rem", marginTop: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" />
                ))}
                <span style={{ fontSize: "0.75rem", color: neu.textSecondary, marginLeft: 6, fontWeight: 600 }}>
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            INTERACTIVE NEUMORPHIC RESUME WORKSPACE PREVIEW
        ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            borderRadius: 24,
            background: neu.cardBg,
            border: neu.cardBorder,
            boxShadow: neu.cardShadowHover,
            padding: 14,
            textAlign: "left",
          }}
        >
          {/* Inner Recessed Well */}
          <div
            style={{
              borderRadius: 18,
              background: neu.insetBg,
              boxShadow: neu.insetShadow,
              border: neu.insetBorder,
              overflow: "hidden",
            }}
          >
            {/* Top Workspace Bar */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(166, 180, 200, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                background: neu.cardBg,
              }}
            >
              {/* Traffic Lights + Path */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239, 68, 68, 0.5)" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 6px rgba(245, 158, 11, 0.5)" }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)" }} />
                </div>
                <div
                  style={{
                    padding: "4px 14px",
                    borderRadius: 8,
                    background: neu.insetBg,
                    boxShadow: neu.insetShadowSm,
                    border: neu.insetBorder,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: neu.textSecondary,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FileText size={13} color="#6366f1" /> portfolio.dev/studio/interactive-preview
                </div>
              </div>

              {/* Template quick tags */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.78rem", color: neu.textSecondary, fontWeight: 600 }}>
                  Active Template:
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    background: neu.accentGradient,
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(99, 102, 241, 0.35)",
                  }}
                >
                  {templates.find((t) => t.id === activeTemplate)?.name}
                </span>

                <a
                  href="/admin/?mode=register"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: neu.accentGradient,
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  Launch Full Studio
                </a>
              </div>
            </div>

            {/* Builder Workspace Body (3 Columns: Section Nav, Document Canvas, Template Palette) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "230px 1fr 150px",
                minHeight: 560,
              }}
              className="hero-grid-responsive"
            >
              {/* Column 1: Neumorphic Section Navigator */}
              <div
                style={{
                  padding: "20px 14px",
                  borderRight: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(166, 180, 200, 0.3)",
                  background: neu.cardBg,
                }}
                className="hero-left-col"
              >
                <div
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: neu.textMuted,
                    padding: "0 8px 12px",
                  }}
                >
                  Interactive Sections
                </div>

                {[
                  { id: "personal", label: "Personal Info", icon: Users },
                  { id: "summary", label: "Summary", icon: FileText },
                  { id: "experience", label: "Work Experience", icon: Briefcase },
                  { id: "education", label: "Education", icon: GraduationCap },
                  { id: "skills", label: "Skills Matrix", icon: Code2 },
                  { id: "projects", label: "Projects", icon: FolderGit2 },
                  { id: "certifications", label: "Certifications", icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: isSelected ? neu.cardBorder : "1px solid transparent",
                        background: isSelected ? neu.insetBg : "transparent",
                        boxShadow: isSelected ? neu.insetShadowSm : "none",
                        color: isSelected ? "#6366f1" : neu.textSecondary,
                        fontSize: "0.85rem",
                        fontWeight: isSelected ? 800 : 600,
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: 6,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}

                <div style={{ marginTop: 20, padding: "0 6px" }}>
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: 12,
                      background: neu.insetBg,
                      boxShadow: neu.insetShadowSm,
                      border: neu.insetBorder,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.76rem", fontWeight: 700, color: neu.textPrimary }}>
                      Live Interactive Sandbox
                    </div>
                    <div style={{ fontSize: "0.72rem", color: neu.textSecondary, marginTop: 4 }}>
                      Click sections or switch templates on right to test real-time rendering.
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Document Preview Canvas */}
              <div
                style={{
                  padding: "26px 30px",
                  background: neu.insetBg,
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                {/* ATS Parser Score Banner (Neumorphic Raised Pill) */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 18px",
                    borderRadius: 14,
                    background: neu.cardBg,
                    boxShadow: neu.cardShadowSm,
                    border: neu.cardBorder,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle2 size={15} />
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10b981" }}>
                      ATS Optimization Score: 98/100 • 100% Parser Compliant
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: neu.textSecondary }}>
                    A4 Export Ready
                  </span>
                </motion.div>

                {/* Simulated A4 Document Sheet with Dynamic Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTemplate}-${activeTab}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      background: "#ffffff",
                      color: "#0f172a",
                      borderRadius: 12,
                      padding: "32px 36px",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.18)",
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                    }}
                  >
                    {/* Candidate Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        borderBottom: `2.5px solid ${
                          templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1"
                        }`,
                        paddingBottom: 18,
                        marginBottom: 18,
                      }}
                    >
                      <div
                        style={{
                          width: 62,
                          height: 62,
                          borderRadius: activeTemplate === "minimal" ? "8px" : "50%",
                          background: `linear-gradient(135deg, ${
                            templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1"
                          }20 0%, ${
                            templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1"
                          }40 100%)`,
                          color: templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1",
                          fontWeight: 800,
                          fontSize: "1.45rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `2px solid ${
                            templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1"
                          }`,
                        }}
                      >
                        KS
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                          Kanhu Charan Sahoo
                        </h2>
                        <div
                          style={{
                            fontSize: "0.92rem",
                            color: templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1",
                            fontWeight: 700,
                            marginTop: 2,
                          }}
                        >
                          Senior Full Stack & UI Architect
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 14,
                            fontSize: "0.77rem",
                            color: "#64748b",
                            marginTop: 6,
                          }}
                        >
                          <span>📍 Bhubaneswar, India</span>
                          <span>✉ kanhu@example.com</span>
                          <span>⌥ github.com/kanhu</span>
                          <span>in linkedin.com/in/kanhu</span>
                        </div>
                      </div>
                    </div>

                    {/* Section Focus Content */}
                    {activeTab === "personal" && (
                      <div>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 6 }}>
                            Professional Profile
                          </div>
                          <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.6, color: "#475569" }}>
                            Architectural lead and full-stack engineer with 5+ years of production experience in React, TypeScript, Node.js, and cloud ecosystems. Proven track record scaling web applications to millions of monthly visits.
                          </p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Phone</div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>+91 98765 43210</div>
                          </div>
                          <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>Portfolio Web</div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>portfolio.dev/portfolio</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "summary" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Executive Summary
                        </div>
                        <p style={{ margin: 0, fontSize: "0.84rem", lineHeight: 1.65, color: "#475569" }}>
                          High-impact frontend architect specializing in design systems, micro-frontends, and accessible component libraries. Spearheaded core performance initiatives delivering 98+ Google Lighthouse scores across tier-1 enterprise platforms.
                        </p>
                      </div>
                    )}

                    {activeTab === "experience" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Work Experience
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontWeight: 700 }}>
                            <span>Senior Frontend Developer</span>
                            <span style={{ color: "#64748b", fontWeight: 500 }}>2024 – Present</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: templates.find((t) => t.id === activeTemplate)?.accent || "#6366f1", fontWeight: 700 }}>
                            Capgemini Technology Pvt Ltd
                          </div>
                          <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: "0.8rem", color: "#475569", lineHeight: 1.55 }}>
                            <li>Architected scalable UI design systems reducing engineering delivery cycles by 35%.</li>
                            <li>Engineered multi-tenant admin dashboards with real-time analytics and RBAC security.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "education" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Education & Academics
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontWeight: 700 }}>
                          <span>B.Tech in Computer Science & Engineering</span>
                          <span style={{ color: "#64748b", fontWeight: 500 }}>2019 – 2023</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: 700 }}>
                          Biju Patnaik University of Technology (BPUT)
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "#475569", margin: "4px 0 0" }}>
                          Graduated with First Class Honors. Specialization in Distributed Systems & Web Tech.
                        </p>
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Technical Proficiencies
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {[
                            "React.js",
                            "TypeScript",
                            "Next.js",
                            "Node.js",
                            "MongoDB",
                            "Framer Motion",
                            "Tailwind CSS",
                            "Material UI",
                            "Redux Toolkit",
                            "REST APIs",
                            "Cloud Computing",
                            "Docker",
                          ].map((skill) => (
                            <span
                              key={skill}
                              style={{
                                background: "#f1f5f9",
                                border: "1px solid #cbd5e1",
                                color: "#1e293b",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "projects" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Featured Projects
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: "0.84rem", fontWeight: 700 }}>
                            Portfolio Studio Platform
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#64748b", margin: "2px 0 4px" }}>
                            React, TypeScript, Redux, Node.js, Neumorphic UI
                          </div>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569" }}>
                            Multi-tenant resume builder with 6 ATS-compliant templates, live PDF export, and synchronized developer portfolios.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === "certifications" && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "#334155", marginBottom: 8 }}>
                          Licenses & Certifications
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                            AWS Certified Cloud Practitioner • Amazon Web Services (2025)
                          </div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                            Advanced React & TypeScript Architecture • Meta Certified (2024)
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Column 3: Template Selector Palette (Tactile Neumorphic Buttons) */}
              <div
                style={{
                  padding: "20px 10px",
                  borderLeft: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(166, 180, 200, 0.3)",
                  background: neu.cardBg,
                }}
                className="hero-right-col"
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: neu.textMuted,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Styles
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {templates.map((tpl) => {
                    const isSelected = activeTemplate === tpl.id;
                    return (
                      <motion.button
                        key={tpl.id}
                        onClick={() => setActiveTemplate(tpl.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: "10px 8px",
                          borderRadius: 12,
                          border: isSelected ? `2px solid ${tpl.accent}` : neu.cardBorder,
                          background: isSelected ? neu.insetBg : neu.cardBg,
                          boxShadow: isSelected ? neu.insetShadowSm : neu.cardShadowSm,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            height: 28,
                            borderRadius: 6,
                            background: `${tpl.accent}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 4,
                          }}
                        >
                          <FileText size={14} color={tpl.accent} />
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: neu.textPrimary }}>
                          {tpl.name.split(" ")[0]}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. KEY FEATURES ROW (5 Neumorphic Pillars)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 850, margin: "0 0 10px" }}>
            Engineered for Career Elevation
          </h2>
          <p style={{ fontSize: "1.05rem", color: neu.textSecondary, margin: 0 }}>
            Every tool is designed to bypass algorithmic filters and impress hiring managers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              icon: FileText,
              color: "#6366f1",
              title: "ATS-Friendly Templates",
              desc: "Engineered single and dual-column layouts designed for maximum scanner readability.",
            },
            {
              icon: Zap,
              color: "#0ea5e9",
              title: "Keyword Suggestion Engine",
              desc: "Get industry-calibrated recommendations to align with job descriptions seamlessly.",
            },
            {
              icon: Share2,
              color: "#10b981",
              title: "Export & Hosted Links",
              desc: "Download selectable A4 vector PDFs or share your live public developer portfolio link.",
            },
            {
              icon: Briefcase,
              color: "#f43f5e",
              title: "Unlimited Versions",
              desc: "Create bespoke tailored resumes for various roles, tech stacks, and industries.",
            },
            {
              icon: ShieldCheck,
              color: "#f59e0b",
              title: "Zero Paywall Lock",
              desc: "Full access to all templates, portfolio sync, and PDF exports without hidden fees.",
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                style={{
                  padding: "26px 22px",
                  borderRadius: 20,
                  background: neu.cardBg,
                  border: neu.cardBorder,
                  boxShadow: neu.cardShadow,
                  transition: "box-shadow 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Neumorphic Inset Icon Well */}
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: neu.insetBg,
                    boxShadow: neu.insetShadowSm,
                    border: neu.insetBorder,
                    color: feat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: "1.08rem", fontWeight: 800, margin: "0 0 8px" }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: neu.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PROFESSIONAL RESUME TEMPLATES SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section
        id="templates"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 38,
          }}
        >
          <div>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 850, margin: "0 0 10px" }}>
              Tailored Visual Archetypes
            </h2>
            <p style={{ fontSize: "1.05rem", color: neu.textSecondary, margin: 0 }}>
              Select a template matching your seniority and domain. Every layout passes ATS benchmarks.
            </p>
          </div>
          <motion.a
            href="/admin/?mode=register"
            whileHover={{ x: 3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.95rem",
              fontWeight: 800,
              color: "#6366f1",
              textDecoration: "none",
            }}
          >
            Explore All In Studio <ArrowRight size={18} />
          </motion.a>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {templates.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                borderRadius: 20,
                background: neu.cardBg,
                border: neu.cardBorder,
                boxShadow: neu.cardShadow,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {tpl.tag && (
                <span
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    background: `${tpl.accent}20`,
                    color: tpl.accent,
                    border: `1px solid ${tpl.accent}40`,
                  }}
                >
                  {tpl.tag}
                </span>
              )}

              {/* Miniature Simulation Preview in Neumorphic Inset Frame */}
              <div
                style={{
                  height: 230,
                  borderRadius: 14,
                  background: neu.insetBg,
                  boxShadow: neu.insetShadow,
                  border: neu.insetBorder,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 18,
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: tpl.accent }} />
                  <div>
                    <div style={{ width: 80, height: 8, background: isDark ? "#334155" : "#cbd5e1", borderRadius: 4 }} />
                    <div
                      style={{
                        width: 50,
                        height: 6,
                        background: isDark ? "#1e293b" : "#e2e8f0",
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    />
                  </div>
                </div>
                <div style={{ height: 2, background: tpl.accent, width: "100%", margin: "4px 0" }} />
                <div style={{ width: "90%", height: 6, background: isDark ? "#334155" : "#cbd5e1", borderRadius: 4 }} />
                <div style={{ width: "70%", height: 6, background: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 4 }} />
                <div style={{ width: "85%", height: 6, background: isDark ? "#1e293b" : "#e2e8f0", borderRadius: 4 }} />
                <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                  <div style={{ width: 36, height: 14, borderRadius: 4, background: `${tpl.accent}30` }} />
                  <div style={{ width: 44, height: 14, borderRadius: 4, background: `${tpl.accent}30` }} />
                  <div style={{ width: 38, height: 14, borderRadius: 4, background: `${tpl.accent}30` }} />
                </div>
              </div>

              <h4 style={{ fontSize: "1.08rem", fontWeight: 800, margin: "0 0 6px" }}>{tpl.name}</h4>
              <p
                style={{
                  fontSize: "0.84rem",
                  color: neu.textSecondary,
                  margin: "0 0 16px",
                  lineHeight: 1.5,
                  flexGrow: 1,
                }}
              >
                {tpl.desc}
              </p>

              <motion.a
                href="/admin/?mode=register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  textAlign: "center",
                  background: neu.cardBg,
                  color: neu.textPrimary,
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  textDecoration: "none",
                  border: neu.cardBorder,
                  boxShadow: neu.cardShadowSm,
                }}
              >
                Use Template
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS (4 Step Process in Neumorphic Sockets)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "50px 24px 80px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 850, margin: "0 0 12px" }}>
            How{" "}
            <span
              style={{
                background: neu.accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Portfolio Studio
            </span>{" "}
            Works
          </h2>
          <p style={{ fontSize: "1.05rem", color: neu.textSecondary, margin: 0 }}>
            Four streamlined steps from portfolio to ATS-ready application.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              step: "1",
              title: "1. Instant Sign Up",
              desc: "Create your free account in seconds with zero credit card required.",
              icon: Users,
              color: "#8b5cf6",
            },
            {
              step: "2",
              title: "2. Input or Sync Data",
              desc: "One-click import from your developer portfolio or input fresh records.",
              icon: FileText,
              color: "#3b82f6",
            },
            {
              step: "3",
              title: "3. Choose & Tailor",
              desc: "Select an ATS archetype, analyze job keywords, and preview live.",
              icon: Palette,
              color: "#10b981",
            },
            {
              step: "4",
              title: "4. Export & Share",
              desc: "Download selectable vector PDF or share your hosted public portfolio.",
              icon: Download,
              color: "#f59e0b",
            },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  padding: "30px 22px",
                  borderRadius: 20,
                  background: neu.cardBg,
                  border: neu.cardBorder,
                  boxShadow: neu.cardShadow,
                  textAlign: "center",
                }}
              >
                {/* Neumorphic Double Socket (Well + Raised Icon) */}
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: neu.insetBg,
                    boxShadow: neu.insetShadow,
                    border: neu.insetBorder,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: neu.cardBg,
                      boxShadow: neu.cardShadowSm,
                      border: neu.cardBorder,
                      color: st.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                </div>
                <h3 style={{ fontSize: "1.12rem", fontWeight: 800, margin: "0 0 8px" }}>{st.title}</h3>
                <p style={{ fontSize: "0.88rem", color: neu.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. STATS / PROOF COUNTER (Neumorphic Inset Capsule)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          style={{
            padding: "36px 30px",
            borderRadius: 24,
            background: neu.insetBg,
            boxShadow: neu.insetShadow,
            border: neu.insetBorder,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 28,
            textAlign: "center",
          }}
        >
          {[
            { value: "10K+", label: "Active Users", icon: Users, color: "#38bdf8" },
            { value: "25K+", label: "Resumes Built", icon: FileText, color: "#a855f7" },
            { value: "98%", label: "ATS Pass Rate", icon: Award, color: "#10b981" },
            { value: "100%", label: "Private & Secure", icon: ShieldCheck, color: "#f59e0b" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: "8px 12px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: neu.cardBg,
                    boxShadow: neu.cardShadowSm,
                    border: neu.cardBorder,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={22} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: neu.textSecondary, fontWeight: 700 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FAQ SECTION (Framer Motion Animated Accordion)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "20px 24px 90px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 850, margin: "0 0 12px" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "1.02rem", color: neu.textSecondary, margin: 0 }}>
            Everything you need to know about your portfolio workspace.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              q: "Is Portfolio Studio really 100% free to start?",
              a: "Yes! You can create your account, manage unlimited resumes, select from any of our 6 ATS-friendly templates, import your portfolio details, and download selectable A4 PDFs without any hidden fees or credit card requirements.",
            },
            {
              q: "How does the Portfolio to Resume import work?",
              a: "Whenever you update your projects, skills, education, or career milestones in your Studio dashboard, you can click 'Import Portfolio Data' inside the Resume Builder. It pre-populates your resume sections without altering your original portfolio data.",
            },
            {
              q: "Are the generated resumes ATS-friendly?",
              a: "Absolutely. All templates are designed with standard headings, semantic hierarchy, clean single or structured two-column grids, and clean fonts that modern Applicant Tracking Systems (ATS) can parse seamlessly.",
            },
            {
              q: "How does the Job-Specific keyword matcher work?",
              a: "Inside the resume editor, paste the target Job Description into the JD Analyzer modal. The system extracts relevant keywords and highlights matches directly against your existing portfolio and resume without hallucinating fake credentials.",
            },
            {
              q: "Can I share a live portfolio website with recruiters?",
              a: "Yes! Every registered user receives a public portfolio link at /portfolio/{username}. You can copy and share this link on LinkedIn, job boards, or application forms.",
            },
          ].map((faq, idx) => {
            const isOpen = !!faqOpen[idx];
            return (
              <motion.div
                key={idx}
                style={{
                  borderRadius: 16,
                  background: neu.cardBg,
                  border: neu.cardBorder,
                  boxShadow: isOpen ? neu.cardShadowHover : neu.cardShadowSm,
                  padding: "18px 22px",
                  cursor: "pointer",
                  transition: "box-shadow 0.25s ease",
                }}
                onClick={() => toggleFaq(idx)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <h4 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 750 }}>{faq.q}</h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: neu.insetBg,
                      boxShadow: neu.insetShadowSm,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={17} color="#6366f1" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.92rem",
                          color: neu.textSecondary,
                          lineHeight: 1.65,
                          borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(166, 180, 200, 0.3)",
                          paddingTop: 12,
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FINAL CALL TO ACTION BANNER (Tactile Neumorphic Border)
      ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px 90px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          style={{
            position: "relative",
            borderRadius: 28,
            background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #9333ea 100%)",
            padding: "54px 44px",
            color: "#ffffff",
            overflow: "hidden",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(99, 102, 241, 0.45), 8px 8px 24px rgba(0, 0, 0, 0.6)"
              : "0 25px 50px -12px rgba(79, 70, 229, 0.4), 8px 8px 24px rgba(166, 180, 200, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              alignItems: "center",
              gap: 36,
              position: "relative",
              zIndex: 2,
            }}
            className="cta-grid-responsive"
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(10px)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  marginBottom: 16,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                Your Career Journey Starts Here
              </div>

              <h2
                style={{
                  fontSize: "clamp(2rem, 3.8vw, 3rem)",
                  fontWeight: 850,
                  lineHeight: 1.15,
                  margin: "0 0 14px",
                  letterSpacing: "-0.025em",
                }}
              >
                Ready to Build Your Future?
              </h2>

              <p
                style={{
                  fontSize: "1.08rem",
                  color: "rgba(255, 255, 255, 0.9)",
                  margin: "0 0 30px",
                  maxWidth: 540,
                  lineHeight: 1.6,
                }}
              >
                Join thousands of professionals who have already created their resumes and landed their dream roles.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <motion.a
                  href="/admin/?mode=register"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: "#ffffff",
                    color: "#4338ca",
                    fontWeight: 800,
                    fontSize: "1rem",
                    padding: "14px 30px",
                    borderRadius: 14,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  Create Your Customized CV <ArrowRight size={18} />
                </motion.a>

                <motion.button
                  onClick={() => setDemoModalOpen(true)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: "rgba(255, 255, 255, 0.18)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    padding: "14px 24px",
                    borderRadius: 14,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Play size={16} fill="#ffffff" /> View Demo
                </motion.button>
              </div>
            </div>

            {/* Right Graphic / Floating Neumorphic Capsule */}
            <div style={{ textAlign: "center" }} className="cta-right-badge">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "inline-block",
                  padding: "26px 30px",
                  borderRadius: 22,
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#a5b4fc", fontWeight: 700 }}>
                  Better Resume ➔ Higher Callback Rate
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 850, marginTop: 6, color: "#ffffff" }}>
                  Dream Jobs 🚀
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)", marginTop: 6 }}>
                  Start your journey on Portfolio Studio
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(166, 180, 200, 0.3)",
          padding: "44px 24px",
          background: neu.cardBg,
          boxShadow: isDark
            ? "inset 0 10px 20px rgba(0, 0, 0, 0.3)"
            : "inset 0 8px 16px rgba(166, 180, 200, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: neu.accentGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              }}
            >
              <FileText size={20} />
            </div>
            <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>Portfolio Studio</span>
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: "0.9rem",
              color: neu.textSecondary,
              fontWeight: 600,
            }}
          >
            <a href="#hero" style={{ color: "inherit", textDecoration: "none" }}>About</a>
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a>
            <a href="#templates" style={{ color: "inherit", textDecoration: "none" }}>Templates</a>
            <Link to="/portfolio" style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>
              Public Portfolio
            </Link>
            <a href="/admin/?mode=login" style={{ color: "inherit", textDecoration: "none" }}>Admin Studio</a>
          </div>

          {/* Domain & Slogan */}
          <div style={{ fontSize: "0.82rem", color: neu.textMuted, textAlign: "right" }}>
            <div>© 2026 Portfolio Studio. All rights reserved.</div>
            <div style={{ marginTop: 4, fontWeight: 700, color: "#6366f1" }}>
              Create. Customize. Share. Get Hired.
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          10. DEMO MODAL (Framer Motion Scale & Fade)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {demoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
            onClick={() => setDemoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                maxWidth: 580,
                width: "100%",
                background: neu.cardBg,
                borderRadius: 24,
                padding: "32px 28px",
                border: neu.cardBorder,
                boxShadow: neu.cardShadowHover,
                color: neu.textPrimary,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: neu.insetBg,
                      boxShadow: neu.insetShadowSm,
                      color: "#6366f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Portfolio Studio Interactive Demo</h3>
                </div>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    color: neu.textSecondary,
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: "0.95rem", color: neu.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
                Portfolio Studio integrates your live developer portfolio with career milestones and admin management. You can explore the portfolio workspace:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <motion.a
                  href="/admin/?mode=login"
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: neu.insetBg,
                    boxShadow: neu.insetShadowSm,
                    border: neu.insetBorder,
                    color: "#6366f1",
                    textDecoration: "none",
                    fontWeight: 750,
                  }}
                >
                  <span>Launch Admin Resume Studio</span>
                  <ArrowRight size={18} />
                </motion.a>

                <motion.div whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/portfolio"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: 14,
                      background: neu.cardBg,
                      boxShadow: neu.cardShadowSm,
                      border: neu.cardBorder,
                      color: neu.textPrimary,
                      textDecoration: "none",
                      fontWeight: 650,
                    }}
                    onClick={() => setDemoModalOpen(false)}
                  >
                    <span>Explore Live Developer Portfolio</span>
                    <ExternalLink size={18} />
                  </Link>
                </motion.div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <motion.button
                  onClick={() => setDemoModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 10,
                    background: neu.cardBg,
                    border: neu.cardBorder,
                    boxShadow: neu.cardShadowSm,
                    color: neu.textSecondary,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for responsive adjustments */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 860px) {
          .hero-grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .hero-left-col { display: none !important; }
          .hero-right-col { display: none !important; }
          .cta-grid-responsive {
            grid-template-columns: 1fr !important;
          }
          .cta-right-badge { display: none !important; }
        }
      `}</style>
    </div>
  );
}
