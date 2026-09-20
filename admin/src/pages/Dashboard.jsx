import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { setActiveTab } from "../redux/store";
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
  Trash2,
  ArrowRight,
  Layers,
  Wrench,
  FileCode,
} from "lucide-react";

/**
 * Portfolio Command Center & Profile Management Dashboard.
 * Includes real-time metrics with sparklines and interactive routing,
 * portrait photo manager storing to MongoDB with blank default silhouette,
 * dynamic profile editor (pre-filling only name & email for new admins),
 * vanishing placeholders on focus, and quick management routing hub.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const authUser = useSelector((state) => state.auth?.user);

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

  // Local Form State - only name & email prefilled by default
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    role: "",
    phone: "",
    email: authUser?.email || "",
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
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || authUser?.fullName || "",
        role: profile.role || "",
        phone: profile.phone || "",
        email: profile.email || authUser?.email || "",
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
      setAvatarRemoved(false);
      setAvatarFile(null);
    } else if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
      }));
    }
  }, [profile, authUser]);

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

  const updateMutation = useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: (data) => {
      setStatusNotice({
        type: "success",
        text: "Profile updated successfully! Changes are live on your portfolio.",
      });
      setAvatarFile(null);
      setAvatarRemoved(false);
      const updatedAvatarUrl = data?.user?.avatar?.url || "";
      setAvatarPreview(updatedAvatarUrl);
      setFormData((prev) => ({
        ...prev,
        avatarUrl: updatedAvatarUrl,
      }));
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
      if (file.size > 10 * 1024 * 1024) {
        setStatusNotice({
          type: "error",
          text: "Image file is too large. Please select an image under 10MB.",
        });
        e.target.value = "";
        return;
      }
      setAvatarFile(file);
      setAvatarRemoved(false);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        setStatusNotice({
          type: "error",
          text: "Image file is too large. Please select an image under 10MB.",
        });
        return;
      }
      setAvatarFile(file);
      setAvatarRemoved(false);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarRemoved(true);
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || authUser?.fullName || "",
        role: profile.role || "",
        phone: profile.phone || "",
        email: profile.email || authUser?.email || "",
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
      setAvatarRemoved(false);
      setAvatarPreview(profile.avatar?.url || "");
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((k) => {
      if (k === "avatarUrl") {
        if (avatarRemoved) {
          payload.append("avatarUrl", "");
          payload.append("removeAvatar", "true");
        } else if (!avatarFile && formData.avatarUrl) {
          payload.append("avatarUrl", formData.avatarUrl);
        }
      } else {
        payload.append(k, formData[k] || "");
      }
    });

    if (avatarFile) {
      payload.append("avatar", avatarFile);
      payload.delete("avatarUrl");
    }

    if (avatarRemoved) {
      payload.append("removeAvatar", "true");
      payload.set("avatarUrl", "");
    }

    updateMutation.mutate(payload);
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            Dashboard Overview
          </h1>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--admin-text-secondary)",
              margin: "4px 0 0",
            }}
          >
            Welcome back, {formData.fullName || "Admin"}! Click any card to navigate & manage your portfolio.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="neumorph-inset-sm"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 12,
              fontSize: "0.82rem",
              color: "var(--admin-text-secondary)",
              fontWeight: 500,
            }}
          >
            <Calendar size={15} color="var(--admin-accent)" />
            <span>{todayFormatted}</span>
          </div>

          <a
            href={profile?.username || authUser?.username ? `/portfolio/${profile?.username || authUser?.username}` : "/portfolio"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              fontSize: "0.82rem",
              textDecoration: "none",
            }}
          >
            <span>Live Portfolio</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Notifications Alert Banner */}
      {statusNotice && (
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            borderLeft: `4px solid ${statusNotice.type === "success" ? "#10b981" : "#ef4444"}`,
            color: statusNotice.type === "success" ? "#10b981" : "#ef4444",
          }}
        >
          {statusNotice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{statusNotice.text}</span>
        </div>
      )}

      {/* Top 4 Interactive Metric Cards - Clicking routes to management page */}
      <div className="grid-4">
        {/* Card 1: Projects */}
        <div
          className="stat-card-neumorph"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(setActiveTab("projects"))}
          style={{
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          title="Click to route to Projects page"
        >
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
                {projects.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Active Projects
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: "0.74rem", color: "#3b82f6", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Manage Projects <ArrowRight size={12} />
            </span>
            <svg width="48" height="24" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 24C12 24 16 10 28 14C40 18 48 4 62 8"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Skills */}
        <div
          className="stat-card-neumorph"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(setActiveTab("skills"))}
          style={{
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          title="Click to route to Skills page"
        >
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
                {skills.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Mastered Skills
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: "0.74rem", color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Manage Skills <ArrowRight size={12} />
            </span>
            <svg width="48" height="24" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 20C12 20 20 28 32 16C44 4 52 14 62 6"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Milestones */}
        <div
          className="stat-card-neumorph"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(setActiveTab("timeline"))}
          style={{
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          title="Click to route to Milestones page"
        >
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
                {timeline.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Milestones
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: "0.74rem", color: "#f59e0b", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Manage Milestones <ArrowRight size={12} />
            </span>
            <svg width="48" height="24" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 26C14 26 22 18 34 20C46 22 50 10 62 12"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Messages */}
        <div
          className="stat-card-neumorph"
          role="button"
          tabIndex={0}
          onClick={() => dispatch(setActiveTab("messages"))}
          style={{
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          title="Click to route to Messages page"
        >
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
                {messages.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Messages Received
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <span style={{ fontSize: "0.74rem", color: "#a855f7", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Open Inbox <ArrowRight size={12} />
            </span>
            <svg width="48" height="24" viewBox="0 0 64 32" fill="none">
              <path
                d="M2 22C14 22 22 12 34 16C46 20 52 6 62 10"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Routing Hub - Direct buttons to each management page */}
      <div
        className="neumorph-card"
        style={{ padding: "20px 24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Layers size={20} color="var(--admin-accent)" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
              Quick Management Routes
            </h3>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
            Select any section to add, edit or delete items
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => dispatch(setActiveTab("projects"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FolderGit2 size={17} color="#3b82f6" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Projects</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveTab("skills"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Code2 size={17} color="#10b981" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Skills</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveTab("timeline"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Trophy size={17} color="#f59e0b" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Milestones</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveTab("software"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Wrench size={17} color="#06b6d4" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Software</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveTab("resume"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileCode size={17} color="#ec4899" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Resume Studio</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setActiveTab("messages"))}
            className="btn-neumorph"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mail size={17} color="#a855f7" />
              <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>Messages</span>
            </div>
            <ArrowRight size={14} color="var(--admin-text-muted)" />
          </button>
        </div>
      </div>

      {/* Main Profile & Photo Management Card */}
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
                Only name and email are prefilled. Complete all fields and upload your photo to reflect live on your portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile}>
          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {/* Left Column: Portrait Avatar Management */}
            <div
              style={{
                width: 240,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                className="neumorph-inset"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1.15",
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  background: isDraggingOver ? "rgba(99, 102, 241, 0.12)" : "var(--admin-bg)",
                  border: isDraggingOver
                    ? "2px dashed var(--admin-accent)"
                    : avatarFile
                    ? "2px solid #10b981"
                    : avatarRemoved
                    ? "2px dashed #ef4444"
                    : "1px solid transparent",
                  transition: "all 0.2s ease",
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
                      opacity: avatarRemoved ? 0.3 : 1,
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 12 }}>
                    <User size={56} color="var(--admin-text-muted)" />
                    <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", textAlign: "center" }}>
                      {isDraggingOver ? "Drop image here" : "No Profile Photo (Click below or drag & drop)"}
                    </span>
                  </div>
                )}

                {/* Staging indicator badge */}
                {avatarFile && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      right: 8,
                      background: "rgba(16, 185, 129, 0.92)",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: 8,
                      textAlign: "center",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    New Photo Staged
                  </div>
                )}

                {avatarRemoved && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      right: 8,
                      background: "rgba(239, 68, 68, 0.92)",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: 8,
                      textAlign: "center",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    Marked for Removal
                  </div>
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

              {/* Upload New Photo Button */}
              <label
                className="btn-neumorph-primary"
                style={{ width: "100%", justifyContent: "center", cursor: "pointer", marginBottom: 8 }}
              >
                <Camera size={16} />
                <span>{avatarFile ? "Change Staged Photo" : "Upload New Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarFileChange}
                />
              </label>

              {/* Remove Photo or Undo Removal Button */}
              {avatarRemoved ? (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarRemoved(false);
                    setAvatarPreview(profile?.avatar?.url || "");
                    setFormData((prev) => ({ ...prev, avatarUrl: profile?.avatar?.url || "" }));
                  }}
                  className="btn-neumorph"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 8, color: "var(--admin-accent)" }}
                >
                  <RotateCcw size={15} />
                  <span>Undo Remove</span>
                </button>
              ) : avatarPreview ? (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="btn-neumorph"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 8, color: "#ef4444" }}
                >
                  <Trash2 size={15} />
                  <span>Remove Photo</span>
                </button>
              ) : null}

              <div style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)", textAlign: "center" }}>
                Drag & drop or browse. PNG, JPG or WEBP up to 10MB.
              </div>
            </div>

            {/* Right Column: 2-Column Fields Grid */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div className="grid-2">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-fullname">
                    <User size={15} color="var(--admin-accent)" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    id="dash-fullname"
                    type="text"
                    required
                    className="neumorph-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Role / Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-role">
                    <Briefcase size={15} color="var(--admin-accent)" />
                    <span>Professional Role / Title</span>
                  </label>
                  <input
                    id="dash-role"
                    type="text"
                    className="neumorph-input"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-email">
                    <Mail size={15} color="var(--admin-accent)" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    id="dash-email"
                    type="email"
                    required
                    className="neumorph-input"
                    placeholder="Enter contact email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-phone">
                    <Phone size={15} color="var(--admin-accent)" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    id="dash-phone"
                    type="text"
                    className="neumorph-input"
                    placeholder="e.g. +1 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-location">
                    <MapPin size={15} color="var(--admin-accent)" />
                    <span>Location</span>
                  </label>
                  <input
                    id="dash-location"
                    type="text"
                    className="neumorph-input"
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Resume Link */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-resume">
                    <FileText size={15} color="var(--admin-accent)" />
                    <span>Resume Download Link / URL</span>
                  </label>
                  <input
                    id="dash-resume"
                    type="text"
                    className="neumorph-input"
                    placeholder="https://drive.google.com/..."
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* GitHub */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-github">
                    <Github size={15} color="var(--admin-accent)" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    id="dash-github"
                    type="text"
                    className="neumorph-input"
                    placeholder="https://github.com/username"
                    value={formData.githubURL}
                    onChange={(e) => setFormData({ ...formData, githubURL: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* LinkedIn */}
                <div className="form-group">
                  <label className="form-label" htmlFor="dash-linkedin">
                    <Linkedin size={15} color="var(--admin-accent)" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    id="dash-linkedin"
                    type="text"
                    className="neumorph-input"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedInURL}
                    onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Bio Paragraph */}
              <div className="form-group" style={{ marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label className="form-label" htmlFor="dash-aboutme" style={{ margin: 0 }}>
                    <FileText size={15} color="var(--admin-accent)" />
                    <span>About Me (Bio Paragraph)</span>
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                    {formData.aboutMe?.length || 0} / 500 characters
                  </span>
                </div>
                <textarea
                  id="dash-aboutme"
                  className="neumorph-input"
                  rows={4}
                  placeholder="Describe your engineering focus, passion, and expertise..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  <span>{updateMutation.isPending ? "Saving..." : "Save Profile & Photo"}</span>
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
            Changes made in this Studio immediately reflect on your public portfolio.
          </span>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          "Dynamic. Modern. Real-time."
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
