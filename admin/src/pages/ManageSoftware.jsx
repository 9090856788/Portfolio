import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSoftware, addSoftware, deleteSoftware } from "../api/adminApi";
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
  Sparkles,
  Search,
} from "lucide-react";

/**
 * Software Applications & Developer Tools matching Screenshot 5:
 * - 4 Metric Stat cards (Total Tools, IDEs, Design & API, Actively Used)
 * - Category filter pills and quick search
 * - 2-Column Neumorphic cards with tool icon, category, tags, and actions
 * - Dashed "+ Add Another Tool" card
 */
const ManageSoftware = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
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

  const { data: software = [] } = useQuery({
    queryKey: ["adminSoftware"],
    queryFn: fetchSoftware,
  });

  const addMutation = useMutation({
    mutationFn: addSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool added successfully!" });
      setName("");
      setDescription("");
      setTags("");
      setSvgUrl("");
      setToolUrl("");
      setModalOpen(false);
      setTimeout(() => setNotice(null), 3000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to add software" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool removed!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    addMutation.mutate({
      name,
      category,
      description: description || `${name} developer workflow tool.`,
      tags: tags || category,
      svgUrl:
        svgUrl ||
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      toolUrl: toolUrl || "",
    });
  };

  // Pre-seed sample tools if list is empty for rich display
  const displayTools = software.length
    ? software
    : [
        {
          _id: "demo-1",
          name: "VS Code",
          category: "IDE",
          categoryFullName: "Integrated Development Environment",
          description:
            "Primary code editor with extensive extensions ecosystem for TypeScript, React, and full-stack development.",
          tags: "IDE, Extensible, Cross Platform",
          svg: {
            url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
          },
          toolUrl: "https://code.visualstudio.com",
        },
        {
          _id: "demo-2",
          name: "Postman",
          category: "API & Testing",
          categoryFullName: "API Client & Testing Suite",
          description:
            "Comprehensive platform for API design, automated testing, mocking, and interactive documentation.",
          tags: "API, Testing, Mocking",
          svg: {
            url: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
          },
          toolUrl: "https://www.postman.com",
        },
        {
          _id: "demo-3",
          name: "Figma",
          category: "Design",
          categoryFullName: "Interface & Prototype Design",
          description:
            "Collaborative cloud interface design tool for high-fidelity UI wireframing and design system tokens.",
          tags: "Design, Prototyping, UI/UX",
          svg: {
            url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
          },
          toolUrl: "https://www.figma.com",
        },
        {
          _id: "demo-4",
          name: "GitHub",
          category: "Version Control",
          categoryFullName: "Code Hosting & Collaboration",
          description:
            "Cloud git repository hosting with GitHub Actions CI/CD workflows and automated releases.",
          tags: "Git, CI/CD, DevOps",
          svg: {
            url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
          },
          toolUrl: "https://github.com",
        },
      ];

  // Category counts
  const idesCount = displayTools.filter(
    (t) =>
      t.category === "IDE" ||
      t.name?.toLowerCase().includes("code") ||
      t.name?.toLowerCase().includes("studio")
  ).length;

  const designApiCount = displayTools.filter(
    (t) =>
      t.category === "Design" ||
      t.category === "API & Testing" ||
      t.name?.toLowerCase().includes("postman") ||
      t.name?.toLowerCase().includes("figma")
  ).length;

  // Filtered
  const filteredTools = useMemo(() => {
    return displayTools
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
          t.tags?.toLowerCase().includes(q)
        );
      });
  }, [displayTools, activeCategory, searchQuery]);

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
            Manage developer tools, IDEs, and environments displayed on your portfolio.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
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
            padding: "10px 18px",
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
                {displayTools.length}
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
                50% ↑ Active
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
                Design & API Tools
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
                100%
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                Actively Used
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
          style={{ display: "inline-flex", padding: 4, borderRadius: 9999, gap: 4 }}
        >
          <button
            className={`filter-pill ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All ({displayTools.length})
          </button>
          <button
            className={`filter-pill ${activeCategory === "IDE" ? "active" : ""}`}
            onClick={() => setActiveCategory("IDE")}
          >
            IDE ({idesCount})
          </button>
          <button
            className={`filter-pill ${activeCategory === "Design" ? "active" : ""}`}
            onClick={() => setActiveCategory("Design")}
          >
            Design
          </button>
          <button
            className={`filter-pill ${activeCategory === "API & Testing" ? "active" : ""}`}
            onClick={() => setActiveCategory("API & Testing")}
          >
            API & Testing
          </button>
          <button
            className={`filter-pill ${activeCategory === "Version Control" ? "active" : ""}`}
            onClick={() => setActiveCategory("Version Control")}
          >
            Version Control
          </button>
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

      {/* 2-Column Tools Grid */}
      <div className="grid-2">
        {filteredTools.map((tool) => {
          const toolTags = tool.tags
            ? tool.tags.split(",").map((t) => t.trim())
            : [tool.category || "Development"];

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
                      {tool.svg?.url || tool.svgUrl ? (
                        <img
                          src={tool.svg?.url || tool.svgUrl}
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
                        {tool.categoryFullName || tool.category || "Developer Tool"}
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

              {/* Action Buttons */}
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

                <button
                  onClick={() => deleteMutation.mutate(tool._id)}
                  className="btn-neumorph-danger"
                  style={{ padding: "6px 10px" }}
                  title="Remove Tool"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashed Add Card matching Screenshot 5 */}
      <div
        onClick={() => setModalOpen(true)}
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
              + Add Another Tool
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
              Showcase the tools you use to build amazing projects.
            </div>
          </div>
        </div>

        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
          Better tools build better experiences ✨
        </span>
      </div>

      {/* Add Tool Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-neumorph">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                Add Developer Tool
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-neumorph"
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Tool Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VS Code, Postman, Docker"
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
                  <option value="API & Testing">API & Testing</option>
                  <option value="Version Control">Version Control & CI/CD</option>
                  <option value="Productivity">Productivity & Utilities</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Official URL</label>
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
                  placeholder="IDE, Extensible, Cross Platform"
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
                  disabled={addMutation.isPending}
                  className="btn-neumorph-primary"
                >
                  {addMutation.isPending ? "Adding..." : "Add Tool"}
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
