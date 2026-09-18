import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../api/adminApi";
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Github,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  FolderGit2,
  Globe,
  Cpu,
  Star,
  Lightbulb,
  Upload,
} from "lucide-react";

/**
 * Projects Showcase Manager matching Screenshot 3:
 * - 4 Metric Stat cards with live counts and SVG sparklines
 * - Filter tabs (All, Live, In Development, Draft, Archived)
 * - Search bar and 3-column project cards grid
 * - Direct "Live Demo" external link and Edit/Delete controls
 * - Dashed "Start building something amazing..." add card
 * - Inspiring bottom builder banner
 */
const ManageProjects = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [notice, setNotice] = useState(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technology, setTechnology] = useState("");
  const [stack, setStack] = useState("MERN");
  const [deploy, setDeploy] = useState("Yes");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const { data: projects = [] } = useQuery({
    queryKey: ["adminProjects"],
    queryFn: fetchProjects,
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGitRepoLink("");
    setProjectLink("");
    setTechnology("");
    setStack("MERN");
    setDeploy("Yes");
    setBannerUrl("");
    setBannerFile(null);
    setBannerPreview("");
    setEditingProject(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title || "");
    setDescription(proj.description || "");
    setGitRepoLink(proj.gitRepoLink || "");
    setProjectLink(proj.projectLink || "");
    setTechnology(proj.technology || "");
    setStack(proj.stack || "MERN");
    setDeploy(proj.deploy || "Yes");
    setBannerUrl(proj.projectBanner?.url || "");
    setBannerPreview(proj.projectBanner?.url || "");
    setBannerFile(null);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let payload;
      if (bannerFile) {
        payload = new FormData();
        payload.append("title", title);
        payload.append("description", description);
        payload.append("gitRepoLink", gitRepoLink);
        payload.append("projectLink", projectLink);
        payload.append("technology", technology);
        payload.append("stack", stack);
        payload.append("deploy", deploy);
        payload.append("projectBanner", bannerFile);
      } else {
        payload = {
          title,
          description,
          gitRepoLink,
          projectLink,
          technology,
          stack,
          deploy,
          projectBannerUrl: bannerUrl,
        };
      }

      if (editingProject) {
        return await updateProject(editingProject._id, payload);
      } else {
        return await addProject(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNotice({
        type: "success",
        text: editingProject
          ? "Project updated successfully!"
          : "New project published successfully!",
      });
      setModalOpen(false);
      resetForm();
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to save project" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNotice({ type: "success", text: "Project deleted successfully!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  // Calculate Metrics
  const totalCount = projects.length;
  const liveCount = projects.filter(
    (p) => p.deploy === "Yes" || p.status === "Live"
  ).length;
  const inDevCount = projects.filter(
    (p) => p.deploy === "No" || p.status === "In Development"
  ).length;
  const draftCount = projects.filter((p) => p.status === "Draft").length;

  // Collect unique technologies used
  const techSet = new Set();
  projects.forEach((p) => {
    if (p.technology) {
      p.technology.split(",").forEach((t) => techSet.add(t.trim()));
    }
  });
  const techCount = techSet.size || 5;

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (activeTab === "Live") return p.deploy === "Yes" || p.status === "Live";
        if (activeTab === "In Development")
          return p.deploy === "No" || p.status === "In Development";
        if (activeTab === "Draft") return p.status === "Draft";
        if (activeTab === "Archived") return p.status === "Archived";
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technology?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "latest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      });
  }, [projects, activeTab, searchQuery, sortOrder]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header with Title and Add Button */}
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
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "var(--admin-accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            PROJECTS
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--admin-text-primary)",
              marginBottom: 4,
            }}
          >
            Manage Projects
          </h1>
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "0.92rem" }}>
            Create, update, or remove portfolio projects. Changes reflect immediately on the client showcase.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-neumorph-primary"
          style={{ padding: "10px 20px" }}
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Real-time Notice */}
      {notice && (
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              notice.type === "success"
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            border:
              notice.type === "success"
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
            color: notice.type === "success" ? "#10b981" : "#ef4444",
            padding: "10px 18px",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{notice.text}</span>
        </div>
      )}

      {/* 4 Metric Stat Cards with Sparklines */}
      <div className="grid-4">
        {/* Total Projects */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3b82f6",
              }}
            >
              <FolderGit2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {totalCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Total Projects
              </div>
            </div>
          </div>
          <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
            <path
              d="M2 20C12 20 18 10 30 14C42 18 48 4 58 8"
              stroke="#3b82f6"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Live Projects */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <Globe size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {liveCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Live Projects
              </div>
            </div>
          </div>
          <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
            <path
              d="M2 18C12 18 20 24 32 14C44 4 50 12 58 6"
              stroke="#10b981"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Technologies Used */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a855f7",
              }}
            >
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {techCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Technologies Used
              </div>
            </div>
          </div>
          <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
            <path
              d="M2 22C14 22 20 12 32 16C44 20 50 8 58 10"
              stroke="#a855f7"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Featured Projects */}
        <div className="stat-card-neumorph">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="neumorph-inset-sm"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
              }}
            >
              <Star size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {Math.min(2, totalCount)}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Featured Projects
              </div>
            </div>
          </div>
          <svg width="60" height="28" viewBox="0 0 60 28" fill="none">
            <path
              d="M2 24C12 24 20 16 32 18C44 20 48 8 58 12"
              stroke="#f59e0b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        className="neumorph-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Status Filter Tabs */}
        <div
          className="neumorph-inset-sm"
          style={{ display: "inline-flex", padding: 4, borderRadius: 9999, gap: 4 }}
        >
          <button
            className={`filter-pill ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All Projects ({totalCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "Live" ? "active" : ""}`}
            onClick={() => setActiveTab("Live")}
          >
            Live ({liveCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "In Development" ? "active" : ""}`}
            onClick={() => setActiveTab("In Development")}
          >
            In Development ({inDevCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "Draft" ? "active" : ""}`}
            onClick={() => setActiveTab("Draft")}
          >
            Draft ({draftCount})
          </button>
          <button
            className={`filter-pill ${activeTab === "Archived" ? "active" : ""}`}
            onClick={() => setActiveTab("Archived")}
          >
            Archived (0)
          </button>
        </div>

        {/* Search & Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 440 }}>
          <div
            className="neumorph-inset-sm"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              flex: 1,
            }}
          >
            <Search size={15} color="var(--admin-text-muted)" />
            <input
              type="text"
              placeholder="Search projects by name, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--admin-text-primary)",
                fontSize: "0.85rem",
                width: "100%",
              }}
            />
          </div>

          <select
            className="neumorph-inset-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "7px 12px",
              fontSize: "0.82rem",
              color: "var(--admin-text-primary)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Projects Grid (3 Columns) */}
      <div className="grid-3">
        {filteredProjects.map((project, idx) => {
          const isLive = project.deploy === "Yes" || project.status === "Live";
          const techList = project.technology
            ? project.technology.split(",").map((t) => t.trim())
            : ["React", "Node.js"];

          return (
            <div
              key={project._id || project.id || idx}
              className="neumorph-card"
              style={{
                padding: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Card Banner Image with Badges */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "var(--admin-inset-bg)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {project.projectBanner?.url || project.bannerUrl ? (
                  <img
                    src={project.projectBanner?.url || project.bannerUrl}
                    alt={project.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    <FolderGit2 size={36} opacity={0.6} />
                    <span style={{ fontSize: "0.78rem" }}>{project.title}</span>
                  </div>
                )}

                {/* Overlaid Badges */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    right: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {idx < 2 && (
                    <span className="badge-pill badge-featured">
                      <Star size={11} fill="#a855f7" />
                      <span>Featured</span>
                    </span>
                  )}
                  <span
                    className={`badge-pill ${
                      isLive ? "badge-live" : "badge-dev"
                    }`}
                    style={{ marginLeft: "auto" }}
                  >
                    <span>{isLive ? "Live" : "In Development"}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      marginBottom: 8,
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--admin-text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: 16,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description || "Interactive modern web application."}
                  </p>

                  {/* Tech Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                    {techList.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          padding: "3px 9px",
                          borderRadius: 6,
                          background: "var(--admin-tag-bg)",
                          color: "var(--admin-tag-color)",
                          border: "var(--admin-tag-border)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 14,
                    borderTop: "1px solid var(--admin-border-subtle)",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    {project.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neumorph"
                        style={{ padding: "6px 12px", fontSize: "0.8rem", textDecoration: "none" }}
                      >
                        <ExternalLink size={13} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.gitRepoLink && (
                      <a
                        href={project.gitRepoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-neumorph"
                        style={{ padding: "6px 10px", fontSize: "0.8rem", textDecoration: "none" }}
                        title="GitHub Repository"
                      >
                        <Github size={14} />
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => openEditModal(project)}
                      className="btn-neumorph"
                      style={{ padding: "6px 10px" }}
                      title="Edit Project"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(project._id || project.id)}
                      className="btn-neumorph-danger"
                      style={{ padding: "6px 10px" }}
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dashed "+ Add Project" Card matching Screenshot 3 */}
        <div
          onClick={openAddModal}
          className="neumorph-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 36,
            textAlign: "center",
            cursor: "pointer",
            border: "2px dashed var(--admin-border-accent)",
            minHeight: 320,
          }}
        >
          <div
            className="neumorph-inset-sm"
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
              marginBottom: 16,
            }}
          >
            <Plus size={26} />
          </div>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 6 }}>
            Start building something amazing...
          </h4>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--admin-text-muted)",
              marginBottom: 18,
              maxWidth: 220,
            }}
          >
            Add a new project to your portfolio and showcase your skills to the world.
          </p>
          <button className="btn-neumorph-primary" style={{ fontSize: "0.85rem" }}>
            <Plus size={15} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Bottom Inspiring Builder Banner */}
      <div
        className="neumorph-card-sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          padding: "16px 24px",
          background: "linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Lightbulb size={20} color="var(--admin-accent)" />
          <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)" }}>
            "Build projects, not just skills. Projects tell your story better than words."
          </span>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          Keep Creating. Keep Growing. 🚀
        </span>
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-neumorph" style={{ maxWidth: 660 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                {editingProject ? "Edit Portfolio Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-neumorph"
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
            >
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Workflow Platform"
                    className="neumorph-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deploy Status</label>
                  <select
                    className="neumorph-input"
                    value={deploy}
                    onChange={(e) => setDeploy(e.target.value)}
                  >
                    <option value="Yes">Live (Deployed)</option>
                    <option value="No">In Development</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="neumorph-input"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    className="neumorph-input"
                    value={gitRepoLink}
                    onChange={(e) => setGitRepoLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind, Node.js, Express"
                  className="neumorph-input"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  rows={3}
                  placeholder="Overview of features, architecture, and user problems solved..."
                  className="neumorph-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Banner Image URL or File Upload */}
              <div className="form-group">
                <label className="form-label">Banner Image URL or Upload</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    className="neumorph-input"
                    value={bannerUrl}
                    onChange={(e) => {
                      setBannerUrl(e.target.value);
                      setBannerPreview(e.target.value);
                    }}
                  />
                  <label
                    className="btn-neumorph"
                    style={{ cursor: "pointer", padding: "10px 14px" }}
                  >
                    <Upload size={16} />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setBannerFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setBannerPreview(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {bannerPreview && (
                  <div
                    className="neumorph-inset-sm"
                    style={{
                      marginTop: 10,
                      maxHeight: 120,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      style={{ width: "100%", height: 120, objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-neumorph"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="btn-neumorph-primary"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
