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
  Sparkles,
  Briefcase,
  Mail,
  Camera,
  Save,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
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
    onSuccess: (data) => {
      setStatusNotice({ type: "success", text: "Profile and photo updated successfully! Changes are live on the portfolio." });
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

  return (
    <div className="content-container">
      {/* Top Welcome & Notification */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>
          Portfolio Command Center
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Manage your personal brand, projects, live photos, and client inquiries from one central control panel.
        </p>
      </div>

      {statusNotice && (
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              statusNotice.type === "success"
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(239, 68, 68, 0.15)",
            border:
              statusNotice.type === "success"
                ? "1px solid rgba(16, 185, 129, 0.35)"
                : "1px solid rgba(239, 68, 68, 0.35)",
            color: statusNotice.type === "success" ? "#6ee7b7" : "#fca5a5",
          }}
        >
          {statusNotice.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{statusNotice.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
            <FolderGit2 size={24} />
          </div>
          <div>
            <div className="stat-val">{projects.length}</div>
            <div className="stat-lbl">Active Projects</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-val">{skills.length}</div>
            <div className="stat-lbl">Mastered Skills</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-val">{timeline.length}</div>
            <div className="stat-lbl">Milestones</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: "rgba(236, 72, 153, 0.15)", color: "#f472b6" }}>
            <Mail size={24} />
          </div>
          <div>
            <div className="stat-val">{messages.length}</div>
            <div className="stat-lbl">Messages Received</div>
          </div>
        </div>
      </div>

      {/* Profile & Photo Management Card */}
      <div className="glass-card" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: "1px solid var(--border-color)", paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <User size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Profile & Photo Management</h2>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <span>View Live Portfolio</span>
            <ExternalLink size={14} />
          </a>
        </div>

        <form onSubmit={handleSaveProfile}>
          {/* Avatar / Photo Uploader Section */}
          <div style={{ background: "rgba(10, 12, 20, 0.4)", padding: 24, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: 28 }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 16, color: "var(--text-secondary)" }}>
              Profile Photo (Reflects Instantly on Public UI)
            </h3>
            <div className="avatar-upload-zone">
              <div className="avatar-preview-box">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
                    <Camera size={16} />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarFileChange}
                    />
                  </label>
                  {avatarFile && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(formData.avatarUrl);
                      }}
                    >
                      Cancel Selection
                    </button>
                  )}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Supports PNG, JPG, or WebP. Or enter an image URL below:
                </div>
                <input
                  type="text"
                  placeholder="https://example.com/your-photo.jpg"
                  className="form-control"
                  style={{ maxWidth: 420 }}
                  value={formData.avatarUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, avatarUrl: e.target.value });
                    if (!avatarFile) setAvatarPreview(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Profile Details Fields */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Professional Role / Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Frontend Developer & UI/UX Specialist"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Resume Download Link / URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://.../resume.pdf"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="text"
                className="form-control"
                value={formData.githubURL}
                onChange={(e) => setFormData({ ...formData, githubURL: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="text"
                className="form-control"
                value={formData.linkedInURL}
                onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="form-label">About Me (Bio Paragraphs)</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Write your professional bio. Separate paragraphs with double newlines."
              value={formData.aboutMe}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary"
              style={{ minWidth: 160 }}
            >
              <Save size={18} />
              <span>{updateMutation.isPending ? "Saving Changes..." : "Save Profile & Photo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
