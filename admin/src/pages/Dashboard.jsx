import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminProfile,
  updateAdminProfile,
  fetchProjects,
  fetchSkills,
  fetchTimeline,
  fetchMessages,
} from "../api/adminApi";
import {
  User,
  FolderGit2,
  Code2,
  Trophy,
  Mail,
  Camera,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  Github,
  Linkedin,
  Briefcase,
  Calendar,
  Rocket,
} from "lucide-react";

/**
 * Portfolio Command Center & Profile Management Dashboard.
 * Faithful to the demo design: includes real-time metrics with sparklines,
 * interactive portrait photo manager, 2-column neumorphic inputs with field icons,
 * and immediate synchronization with the public portfolio.
 */
const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["adminProjects"],
    queryFn: fetchProjects,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: fetchSkills,
  });

  const { data: timeline = [] } = useQuery({
    queryKey: ["adminTimeline"],
    queryFn: fetchTimeline,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: fetchMessages,
  });

  // Local Form State for Profile & Photo
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    phone: "",
    email: "",
    location: "",
    aboutMe: "",
    portfolioURL: "",
    githubURL: "",
    linkedInURL: "",
    twitterURL: "",
    resumeUrl: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [statusNotice, setStatusNotice] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        role: profile.role || "",
        phone: profile.phone || "",
        email: profile.email || "",
        location: profile.location || "",
        aboutMe: profile.aboutMe || "",
        portfolioURL: profile.portfolioURL || "",
        githubURL: profile.githubURL || "",
        linkedInURL: profile.linkedInURL || "",
        twitterURL: profile.twitterURL || "",
        resumeUrl: profile.resume?.url || "",
        avatarUrl: profile.avatar?.url || "",
      });
      setAvatarPreview(profile.avatar?.url || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      setStatusNotice({
        type: "success",
        text: "Profile and photo updated successfully! Changes are live on the portfolio.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      queryClient.invalidateQueries({ queryKey: ["portfolioUser"] });
      setTimeout(() => setStatusNotice(null), 5000);
    },
    onError: (err) => {
      setStatusNotice({ type: "error", text: err.message || "Failed to update profile" });
    },
  });

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        role: profile.role || "",
        phone: profile.phone || "",
        email: profile.email || "",
        location: profile.location || "",
        aboutMe: profile.aboutMe || "",
        portfolioURL: profile.portfolioURL || "",
        githubURL: profile.githubURL || "",
        linkedInURL: profile.linkedInURL || "",
        twitterURL: profile.twitterURL || "",
        resumeUrl: profile.resume?.url || "",
        avatarUrl: profile.avatar?.url || "",
      });
      setAvatarFile(null);
      setAvatarPreview(profile.avatar?.url || "");
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (avatarFile) {
      const payload = new FormData();
      Object.keys(formData).forEach((k) => {
        payload.append(k, formData[k]);
      });
      payload.append("avatar", avatarFile);
      updateMutation.mutate(payload);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top Title & Live Date Pill */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--admin-text-primary)",
              marginBottom: 4,
            }}
          >
            Portfolio Command Center
          </h1>
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "0.92rem" }}>
            Manage your personal brand, projects, skills, experience and more from one centralized panel.
          </p>
        </div>

        <div
          className="neumorph-inset-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px",
            borderRadius: 14,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(99, 102, 241, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Calendar size={16} />
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
              {todayFormatted}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--admin-text-muted)" }}>
              Keep building your future!
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Notice */}
      {statusNotice && (
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              statusNotice.type === "success"
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            border:
              statusNotice.type === "success"
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
            color: statusNotice.type === "success" ? "#10b981" : "#ef4444",
            padding: "12px 18px",
          }}
        >
          {statusNotice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{statusNotice.text}</span>
        </div>
      )}

      {/* Top 4 Metric Stat Cards with Sparklines */}
      <div className="grid-4">
        {/* Card 1: Projects */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <FolderGit2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {projects.length || 3}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Active Projects
              </div>
            </div>
          </div>
          {/* Decorative Sparkline wave */}
          <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 24C12 24 16 10 28 14C40 18 48 4 62 8"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 2: Skills */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <Code2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {skills.length || 10}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Mastered Skills
              </div>
            </div>
          </div>
          <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 20C12 20 20 28 32 16C44 4 52 14 62 6"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 3: Milestones */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
              }}
            >
              <Trophy size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {timeline.length || 3}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Milestones
              </div>
            </div>
          </div>
          <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 26C14 26 22 18 34 20C46 22 50 10 62 12"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card 4: Messages */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 46,
                height: 46,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a855f7",
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {messages.length || 2}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Messages Received
              </div>
            </div>
          </div>
          <svg width="64" height="32" viewBox="0 0 64 32" fill="none">
            <path
              d="M2 22C14 22 22 12 34 16C46 20 52 6 62 10"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Main Profile & Photo Management Neumorphic Card */}
      <div className="neumorph-card">
        {/* Card Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            paddingBottom: 20,
            marginBottom: 24,
            borderBottom: "1px solid var(--admin-border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--admin-accent)",
              }}
            >
              <User size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.18rem", fontWeight: 700, margin: 0 }}>
                Profile & Photo Management
              </h2>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--admin-text-secondary)",
                  margin: "2px 0 0",
                }}
              >
                Keep your profile up to date. This information will be reflected across your portfolio.
              </p>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neumorph"
            style={{ textDecoration: "none", fontSize: "0.84rem" }}
          >
            <span>View Live Portfolio</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {/* Left Column: Portrait Photo Box */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 250,
                flexShrink: 0,
              }}
            >
              <div
                className="neumorph-inset"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1.15",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={56} color="var(--admin-text-muted)" />
                )}

                {/* Floating Camera Button on Corner */}
                <label
                  className="btn-neumorph"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 34,
                    height: 34,
                    padding: 0,
                    borderRadius: 10,
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Choose image file"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarFileChange}
                  />
                </label>
              </div>

              <label
                className="btn-neumorph-primary"
                style={{ width: "100%", justifyContent: "center", cursor: "pointer", marginBottom: 8 }}
              >
                <Camera size={16} />
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarFileChange}
                />
              </label>

              <div style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)", textAlign: "center" }}>
                Supports PNG, JPG or WEBP. Max size 5MB.
              </div>
            </div>

            {/* Right Column: 2-Column Fields Grid */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="grid-2">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label">
                    <User size={15} color="var(--admin-accent)" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="neumorph-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                {/* Role / Title */}
                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={15} color="var(--admin-accent)" />
                    <span>Professional Role / Title</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="e.g. Frontend Developer & UI/UX Specialist"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={15} color="var(--admin-accent)" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="neumorph-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={15} color="var(--admin-accent)" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={15} color="var(--admin-accent)" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Resume Link */}
                <div className="form-group">
                  <label className="form-label">
                    <FileText size={15} color="var(--admin-accent)" />
                    <span>Resume Download Link / URL</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="https://drive.google.com/..."
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  />
                </div>

                {/* GitHub */}
                <div className="form-group">
                  <label className="form-label">
                    <Github size={15} color="var(--admin-accent)" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    value={formData.githubURL}
                    onChange={(e) => setFormData({ ...formData, githubURL: e.target.value })}
                  />
                </div>

                {/* LinkedIn */}
                <div className="form-group">
                  <label className="form-label">
                    <Linkedin size={15} color="var(--admin-accent)" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="text"
                    className="neumorph-input"
                    value={formData.linkedInURL}
                    onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })}
                  />
                </div>
              </div>

              {/* Bio Paragraph */}
              <div className="form-group" style={{ marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    <FileText size={15} color="var(--admin-accent)" />
                    <span>About Me (Bio Paragraph)</span>
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                    {formData.aboutMe?.length || 0} / 500 characters
                  </span>
                </div>
                <textarea
                  className="neumorph-input"
                  rows={4}
                  placeholder="Describe your engineering focus, passion, and expertise..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 14,
                  marginTop: 18,
                }}
              >
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-neumorph"
                  style={{ minWidth: 100 }}
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn-neumorph-primary"
                  style={{ minWidth: 150 }}
                >
                  <Save size={16} />
                  <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Inspiring Bottom Banner */}
      <div
        className="neumorph-card-sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "14px 22px",
          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Rocket size={18} color="var(--admin-accent)" />
          <span style={{ fontSize: "0.85rem", color: "var(--admin-text-secondary)" }}>
            Small steps every day lead to big opportunities.
          </span>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          "Build. Learn. Grow."
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
