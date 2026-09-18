import React, { useState } from "react";
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
  Upload,
} from "lucide-react";

const ManageProjects = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [notice, setNotice] = useState(null);

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

  const { data: projects = [], isLoading } = useQuery({
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
        text: editingProject ? "Project updated successfully!" : "New project published successfully!",
      });
      setModalOpen(false);
      resetForm();
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Operation failed" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNotice({ type: "success", text: "Project deleted successfully!" });
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to delete" });
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      setNotice({ type: "error", text: "Title and description are required." });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="content-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>Manage Projects</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Create, update, or remove portfolio projects. Changes reflect immediately on the client showcase.
          </p>
        </div>
        <button id="btn-add-new-project" onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {notice && (
        <div
          style={{
            padding: "14px 20px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: notice.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: notice.type === "success" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(239, 68, 68, 0.35)",
            color: notice.type === "success" ? "#6ee7b7" : "#fca5a5",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: 60 }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No projects found in database.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {projects.map((proj) => (
            <div key={proj._id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ height: 160, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "#1a1d2e", marginBottom: 16 }}>
                  {proj.projectBanner?.url ? (
                    <img src={proj.projectBanner.url} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{proj.title}</h3>
                  <span style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: 4, background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc" }}>
                    {proj.stack || "Web"}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: 14 }}>
                  {proj.description?.length > 120 ? `${proj.description.slice(0, 120)}...` : proj.description}
                </p>
                {proj.technology && (
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 16 }}>
                    <strong>Tech:</strong> {proj.technology}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {proj.gitRepoLink && (
                    <a href={proj.gitRepoLink} target="_blank" rel="noreferrer" title="GitHub Repo" style={{ color: "var(--text-secondary)" }}>
                      <Github size={18} />
                    </a>
                  )}
                  {proj.projectLink && (
                    <a href={proj.projectLink} target="_blank" rel="noreferrer" title="Live Preview" style={{ color: "var(--accent-primary)" }}>
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEditModal(proj)} className="btn btn-secondary btn-sm" title="Edit Project">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
                        deleteMutation.mutate(proj._id);
                      }
                    }}
                    className="btn btn-danger btn-sm"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {editingProject ? "Update Project" : "Create New Project"}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack E-Commerce Platform"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea
                  required
                  placeholder="Explain the project features, architecture, and solutions..."
                  className="form-control"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Banner Upload Box */}
              <div className="form-group">
                <label className="form-label">Project Banner Image</label>
                <div className="banner-upload-box">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner Preview" />
                  ) : (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <Upload size={28} color="var(--accent-primary)" style={{ margin: "0 auto 8px" }} />
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        Click to select banner image
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                  />
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 6 }}>
                  Or enter image URL:
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                  style={{ marginTop: 4 }}
                  value={bannerUrl}
                  onChange={(e) => {
                    setBannerUrl(e.target.value);
                    if (!bannerFile) setBannerPreview(e.target.value);
                  }}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Technologies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Express, MongoDB"
                    className="form-control"
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tech Stack Category</label>
                  <select className="form-control" value={stack} onChange={(e) => setStack(e.target.value)}>
                    <option value="MERN">MERN Stack</option>
                    <option value="FullStack">Full Stack</option>
                    <option value="Frontend">Frontend React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Mobile">Mobile Application</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub Repository Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    className="form-control"
                    value={gitRepoLink}
                    onChange={(e) => setGitRepoLink(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Live Project Demo Link</label>
                  <input
                    type="url"
                    placeholder="https://myproject.dev"
                    className="form-control"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="btn btn-primary">
                  {saveMutation.isPending ? "Saving..." : editingProject ? "Update Project" : "Publish Project"}
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
