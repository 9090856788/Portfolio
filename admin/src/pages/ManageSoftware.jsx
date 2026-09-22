import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSoftware, addSoftware, updateSoftware, deleteSoftware } from "../api/adminApi";
import {
  Plus,
  Trash2,
  Wrench,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
  Code2,
  Palette,
  ExternalLink,
  Search,
  Edit2,
  Terminal,
  Database,
  Sparkles,
} from "lucide-react";

const CATEGORY_NAMES = {
  IDE: "Integrated Development Environment",
  Design: "Interface & Prototype Design",
  "API & Testing": "API Client & Testing Suite",
  "Version Control": "Code Hosting & Collaboration",
  DevOps: "Containerization & Cloud Infrastructure",
  Database: "Database Management & GUI",
  Productivity: "Productivity & Developer Utilities",
};

const POPULAR_PRESETS = [
  {
    name: "VS Code",
    category: "IDE",
    description: "Extensible code editor with support for TypeScript, React, and full-stack development.",
    tags: "IDE, Extensible, Web",
    svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    toolUrl: "https://code.visualstudio.com",
  },
  {
    name: "Postman",
    category: "API & Testing",
    description: "Comprehensive platform for API design, automated testing, mocking, and interactive documentation.",
    tags: "API, Testing, Mocking",
    svgUrl: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
    toolUrl: "https://www.postman.com",
  },
  {
    name: "Figma",
    category: "Design",
    description: "Collaborative cloud interface design tool for high-fidelity UI wireframing and design systems.",
    tags: "Design, UI/UX, Vector",
    svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    toolUrl: "https://www.figma.com",
  },
  {
    name: "GitHub",
    category: "Version Control",
    description: "Cloud git repository hosting with GitHub Actions CI/CD workflows and automated releases.",
    tags: "Git, CI/CD, DevOps",
    svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    toolUrl: "https://github.com",
  },
  {
    name: "Docker",
    category: "DevOps",
    description: "Enterprise containerization platform for bundling and deploying microservices securely.",
    tags: "Containers, DevOps, Cloud",
    svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    toolUrl: "https://www.docker.com",
  },
  {
    name: "MongoDB Compass",
    category: "Database",
    description: "Interactive visual GUI environment for querying, analyzing, and indexing MongoDB documents.",
    tags: "NoSQL, Database, Schema",
    svgUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    toolUrl: "https://www.mongodb.com/products/compass",
  },
];

/**
 * Dynamic Software Applications & Developer Tools:
 * - Real-time dynamic CRUD (Add, Edit/Update, Delete)
 * - Directly synced with database and public portfolio
 * - Category filtering, search, and metric stats
 */
const ManageSoftware = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("IDE");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [svgUrl, setSvgUrl] = useState("");
  const [toolUrl, setToolUrl] = useState("");

  const { data: software = [], isLoading } = useQuery({
    queryKey: ["adminSoftware"],
    queryFn: fetchSoftware,
  });

  const resetForm = () => {
    setEditingItem(null);
    setName("");
    setCategory("IDE");
    setDescription("");
    setTags("");
    setSvgUrl("");
    setToolUrl("");
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleEdit = (tool) => {
    setEditingItem(tool);
    setName(tool.name || "");
    setCategory(tool.category || "IDE");
    setDescription(tool.description || "");
    setTags(tool.tags || "");
    setSvgUrl(tool.svg?.url || tool.svgUrl || "");
    setToolUrl(tool.toolUrl || "");
    setModalOpen(true);
  };

  const applyPreset = (preset) => {
    setName(preset.name);
    setCategory(preset.category);
    setDescription(preset.description);
    setTags(preset.tags);
    setSvgUrl(preset.svgUrl);
    setToolUrl(preset.toolUrl);
  };

  const addMutation = useMutation({
    mutationFn: addSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool added successfully! Reflected in portfolio." });
      setModalOpen(false);
      resetForm();
      setTimeout(() => setNotice(null), 3500);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to add software tool." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateSoftware(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool updated successfully! Reflected in portfolio." });
      setModalOpen(false);
      resetForm();
      setTimeout(() => setNotice(null), 3500);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to update software tool." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool removed! Reflected in portfolio." });
      setTimeout(() => setNotice(null), 3500);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to delete software tool." });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      category,
      categoryFullName: CATEGORY_NAMES[category] || category,
      description: description.trim() || `${name.trim()} developer workflow tool.`,
      tags: tags.trim() || category,
      svgUrl: svgUrl.trim() || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      toolUrl: toolUrl.trim(),
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleDelete = (id, toolName) => {
    if (window.confirm(`Are you sure you want to remove "${toolName}" from your software tools?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Metric Computations
  const idesCount = software.filter(
    (t) =>
      t.category === "IDE" ||
      t.name?.toLowerCase().includes("code") ||
      t.name?.toLowerCase().includes("studio") ||
      t.name?.toLowerCase().includes("intellij")
  ).length;

  const designApiCount = software.filter(
    (t) =>
      t.category === "Design" ||
      t.category === "API & Testing" ||
      t.name?.toLowerCase().includes("postman") ||
      t.name?.toLowerCase().includes("figma")
  ).length;

  // Filtered list
  const filteredTools = useMemo(() => {
    return software
      .filter((t) => {
        if (activeCategory === "All") return true;
        return t.category === activeCategory;
      })
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
        );
      });
  }, [software, activeCategory, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
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
            TOOLS & ENVIRONMENT
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
            Software Applications
          </h1>
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "0.92rem" }}>
            Add, update, and manage the developer tools and environments displayed dynamically on your portfolio.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-neumorph-primary"
          style={{ padding: "10px 20px" }}
        >
          <Plus size={18} />
          <span>Add Software</span>
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
            padding: "12px 18px",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{notice.text}</span>
        </div>
      )}

      {/* 4 Metric Stat Cards */}
      <div className="grid-4">
        {/* Total Tools */}
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
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {software.length}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Total Tools
              </div>
            </div>
          </div>
        </div>

        {/* IDEs */}
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
              <Code2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {idesCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700, marginTop: 4 }}>
                IDEs & Editors
              </div>
            </div>
          </div>
        </div>

        {/* Design & API */}
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
              <Palette size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {designApiCount}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Design & API
              </div>
            </div>
          </div>
        </div>

        {/* Actively Used */}
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
              <Wrench size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1 }}>
                {software.length > 0 ? "100%" : "0%"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Live In Portfolio
              </div>
            </div>
          </div>
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
        <div
          className="neumorph-inset-sm"
          style={{ display: "inline-flex", padding: 4, borderRadius: 9999, gap: 4, flexWrap: "wrap" }}
        >
          {["All", "IDE", "Design", "API & Testing", "Version Control", "DevOps", "Database"].map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} {cat === "All" ? `(${software.length})` : ""}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          className="neumorph-inset-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            minWidth: 260,
          }}
        >
          <Search size={15} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search software tools..."
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
      </div>

      {/* Empty State */}
      {!isLoading && software.length === 0 && (
        <div
          className="neumorph-card"
          style={{
            textAlign: "center",
            padding: "48px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            className="neumorph-inset-sm"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Wrench size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 6px 0" }}>
              No software tools added yet
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--admin-text-secondary)",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              Add your IDEs, design tools, and developer utilities. They will immediately appear on your live portfolio under Experience & Edu.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 8 }}>
            <button
              onClick={openAddModal}
              className="btn-neumorph-primary"
              style={{ padding: "10px 22px" }}
            >
              <Plus size={16} />
              <span>Add Custom Tool</span>
            </button>
          </div>

          {/* Quick Presets for fast setup */}
          <div style={{ marginTop: 16, width: "100%", maxWidth: 640 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--admin-text-muted)", marginBottom: 12 }}>
              OR QUICK-ADD POPULAR TOOLS (1-CLICK):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              {POPULAR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    addMutation.mutate({
                      name: preset.name,
                      category: preset.category,
                      categoryFullName: CATEGORY_NAMES[preset.category] || preset.category,
                      description: preset.description,
                      tags: preset.tags,
                      svgUrl: preset.svgUrl,
                      toolUrl: preset.toolUrl,
                    });
                  }}
                  className="btn-neumorph"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    fontSize: "0.82rem",
                  }}
                  disabled={addMutation.isPending}
                >
                  <img src={preset.svgUrl} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
                  <span>+ {preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Tools Grid */}
      {filteredTools.length > 0 && (
        <div className="grid-2">
          {filteredTools.map((tool) => {
            const toolTags = tool.tags
              ? tool.tags.split(",").map((t) => t.trim())
              : [tool.category || "Development"];

            const toolIcon = tool.svg?.url || tool.svgUrl;

            return (
              <div
                key={tool._id}
                className="neumorph-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "22px 24px",
                }}
              >
                <div>
                  {/* Card Top Row: Icon, Title & Active Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        className="neumorph-inset-sm"
                        style={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 8,
                        }}
                      >
                        {toolIcon ? (
                          <img
                            src={toolIcon}
                            alt={tool.name}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <Wrench size={22} color="var(--admin-accent)" />
                        )}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.08rem", fontWeight: 700, margin: 0 }}>
                          {tool.name}
                        </h3>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--admin-text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {tool.categoryFullName || CATEGORY_NAMES[tool.category] || tool.category || "Developer Tool"}
                        </div>
                      </div>
                    </div>

                    <span className="badge-pill badge-live">
                      <span>Active</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.84rem",
                      color: "var(--admin-text-secondary)",
                      lineHeight: 1.55,
                      marginBottom: 16,
                    }}
                  >
                    {tool.description || "Core tool in the development and deployment workflow."}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                    {toolTags.map((tag, idx) => (
                      <span
                        key={idx}
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

                {/* Action Buttons: Open, Edit & Delete */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    borderTop: "1px solid var(--admin-border-subtle)",
                  }}
                >
                  {tool.toolUrl ? (
                    <a
                      href={tool.toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-neumorph"
                      style={{ padding: "6px 14px", fontSize: "0.82rem", textDecoration: "none" }}
                    >
                      <ExternalLink size={13} />
                      <span>Open</span>
                    </a>
                  ) : (
                    <span />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(tool)}
                      className="btn-neumorph"
                      style={{ padding: "6px 10px" }}
                      title="Edit Tool"
                    >
                      <Edit2 size={14} color="var(--admin-accent)" />
                    </button>
                    <button
                      onClick={() => handleDelete(tool._id, tool.name)}
                      className="btn-neumorph-danger"
                      style={{ padding: "6px 10px" }}
                      title="Remove Tool"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dashed Add Card */}
      <div
        onClick={openAddModal}
        className="neumorph-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          padding: "20px 28px",
          cursor: "pointer",
          border: "2px dashed var(--admin-border-accent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            className="neumorph-inset-sm"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Plus size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              + Add Another Software Tool
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
              Showcase the developer tools, IDEs, and utilities you use daily.
            </div>
          </div>
        </div>

        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          Dynamically reflected on portfolio ✨
        </span>
      </div>

      {/* Add / Edit Tool Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-neumorph" style={{ maxWidth: 560 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                  {editingItem ? "Edit Developer Tool" : "Add Developer Tool"}
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "var(--admin-text-muted)" }}>
                  {editingItem
                    ? "Update tool details and URLs. Changes save immediately to database and portfolio."
                    : "Add a tool to your toolkit. It will appear on your public portfolio."}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-neumorph"
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Presets Bar (Shown when adding a new tool) */}
            {!editingItem && (
              <div style={{ marginBottom: 18, padding: "10px 14px", borderRadius: 10, background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--admin-accent)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Quick Fill from Presets:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {POPULAR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="btn-neumorph"
                      style={{ padding: "4px 9px", fontSize: "0.76rem" }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tool Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VS Code, Postman, Docker, Figma"
                  className="neumorph-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="neumorph-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="IDE">IDE (Integrated Development Environment)</option>
                  <option value="Design">Design & UI/UX</option>
                  <option value="API & Testing">API Client & Testing</option>
                  <option value="Version Control">Version Control & CI/CD</option>
                  <option value="DevOps">DevOps & Cloud Infrastructure</option>
                  <option value="Database">Database Management & GUI</option>
                  <option value="Productivity">Productivity & Utilities</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Official Tool URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="neumorph-input"
                  value={toolUrl}
                  onChange={(e) => setToolUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logo / SVG Icon URL</label>
                <input
                  type="text"
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                  className="neumorph-input"
                  value={svgUrl}
                  onChange={(e) => setSvgUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="IDE, Extensible, Web"
                  className="neumorph-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you use this tool for in your workflow..."
                  className="neumorph-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-neumorph"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="btn-neumorph-primary"
                >
                  {editingItem
                    ? updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"
                    : addMutation.isPending
                    ? "Adding..."
                    : "Add Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSoftware;
