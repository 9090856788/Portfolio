import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTimeline,
  addTimeline,
  updateTimeline,
  deleteTimeline,
} from "../api/adminApi";
import {
  Plus,
  Trash2,
  Edit,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  X,
  Flag,
  Calendar,
  Building,
} from "lucide-react";

/**
 * Experience & Education Timeline Manager matching Screenshot 4:
 * - Inspiring summit artwork quote banner
 * - Filter pills (All, Work Experience, Education)
 * - Connected vertical timeline track with glowing milestone nodes
 * - Neumorphic cards with duration, current status pills, and tech tags
 * - Dashed "+ Add New Milestone" card
 */
const ManageTimeline = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [notice, setNotice] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("work"); // 'work' or 'education'
  const [tags, setTags] = useState("");

  const { data: timeline = [] } = useQuery({
    queryKey: ["adminTimeline"],
    queryFn: fetchTimeline,
  });

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setPeriod("");
    setDescription("");
    setType("work");
    setTags("");
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCompany(item.company || "");
    setPeriod(item.period || "");
    setDescription(item.description || "");
    const isEdu =
      item.type === "education" ||
      item.title?.toLowerCase().includes("bachelor") ||
      item.title?.toLowerCase().includes("degree") ||
      item.title?.toLowerCase().includes("school") ||
      item.title?.toLowerCase().includes("college");
    setType(isEdu ? "education" : "work");
    setTags(item.tags || "");
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        company,
        period: period || "2023 - Present",
        description,
        type,
        tags,
        from: period.split("-")[0]?.trim() || "2023",
        to: period.split("-")[1]?.trim() || "Present",
      };

      if (editingItem) {
        return await updateTimeline(editingItem._id, payload);
      } else {
        return await addTimeline(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      setNotice({
        type: "success",
        text: editingItem
          ? "Milestone updated successfully!"
          : "Timeline milestone added successfully!",
      });
      setModalOpen(false);
      resetForm();
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to save milestone" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      setNotice({ type: "success", text: "Milestone deleted successfully!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  // Categorize
  const workItems = timeline.filter((item) => {
    const isEdu =
      item.type === "education" ||
      item.title?.toLowerCase().includes("bachelor") ||
      item.title?.toLowerCase().includes("degree") ||
      item.title?.toLowerCase().includes("school") ||
      item.title?.toLowerCase().includes("college");
    return !isEdu;
  });

  const eduItems = timeline.filter((item) => {
    const isEdu =
      item.type === "education" ||
      item.title?.toLowerCase().includes("bachelor") ||
      item.title?.toLowerCase().includes("degree") ||
      item.title?.toLowerCase().includes("school") ||
      item.title?.toLowerCase().includes("college");
    return isEdu;
  });

  const filteredItems = useMemo(() => {
    if (activeFilter === "Work") return workItems;
    if (activeFilter === "Education") return eduItems;
    return timeline;
  }, [timeline, activeFilter, workItems, eduItems]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top Header Row with Summit Quote Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
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
            EXPERIENCE & EDUCATION
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
            Manage Timeline
          </h1>
          <p style={{ color: "var(--admin-text-secondary)", fontSize: "0.92rem" }}>
            Add and manage your career milestones, work experience, and educational background.
          </p>
        </div>

        {/* Scenic Summit Quote Card */}
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 20px",
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.12) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.28)",
          }}
        >
          <div
            className="neumorph-inset-sm"
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Flag size={18} />
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
              "A journey of a thousand lines of code begins with a single step."
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--admin-accent)", fontWeight: 600 }}>
              Milestones & Progress
            </div>
          </div>
        </div>
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

      {/* Filter Tabs & Add Button Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div
          className="neumorph-inset-sm"
          style={{ display: "inline-flex", padding: 4, borderRadius: 9999, gap: 4 }}
        >
          <button
            className={`filter-pill ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            All ({timeline.length})
          </button>
          <button
            className={`filter-pill ${activeFilter === "Work" ? "active" : ""}`}
            onClick={() => setActiveFilter("Work")}
          >
            Work Experience ({workItems.length})
          </button>
          <button
            className={`filter-pill ${activeFilter === "Education" ? "active" : ""}`}
            onClick={() => setActiveFilter("Education")}
          >
            Education ({eduItems.length})
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="btn-neumorph-primary"
          style={{ padding: "9px 18px" }}
        >
          <Plus size={17} />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Connected Vertical Timeline Track Container */}
      <div style={{ position: "relative", paddingLeft: 36, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Continuous glowing vertical trace line */}
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 24,
            bottom: 24,
            width: 2,
            background: "linear-gradient(180deg, #6366f1 0%, #8b5cf6 50%, rgba(99, 102, 241, 0.2) 100%)",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)",
          }}
        />

        {filteredItems.map((item, idx) => {
          const isEdu =
            item.type === "education" ||
            item.title?.toLowerCase().includes("bachelor") ||
            item.title?.toLowerCase().includes("degree") ||
            item.title?.toLowerCase().includes("school") ||
            item.title?.toLowerCase().includes("college");

          const isCurrent =
            item.period?.toLowerCase().includes("present") ||
            item.to?.toLowerCase().includes("present");

          // Default fallback tags if not specified
          const itemTags = item.tags
            ? item.tags.split(",").map((t) => t.trim())
            : isEdu
            ? ["Data Structures", "Web Technologies", "Software Engineering"]
            : ["React", "TypeScript", "Redux", "Tailwind CSS"];

          return (
            <div key={item._id || item.id || idx} style={{ position: "relative" }}>
              {/* Glowing Node on Timeline Line */}
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 26,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: isEdu ? "#f59e0b" : "#6366f1",
                  border: "3px solid var(--admin-card-bg)",
                  boxShadow: `0 0 12px ${isEdu ? "#f59e0b" : "#6366f1"}`,
                  zIndex: 2,
                }}
              />

              {/* Milestone Neumorphic Card */}
              <div className="neumorph-card" style={{ padding: "22px 26px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      className="neumorph-inset-sm"
                      style={{
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isEdu ? "#f59e0b" : "#6366f1",
                      }}
                    >
                      {isEdu ? <GraduationCap size={22} /> : <Briefcase size={22} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h3 style={{ fontSize: "1.12rem", fontWeight: 700, margin: 0 }}>
                          {item.title}
                        </h3>
                        {isCurrent && (
                          <span className="badge-pill badge-live">
                            <span>Current</span>
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: "0.85rem",
                          color: "var(--admin-text-secondary)",
                          marginTop: 3,
                        }}
                      >
                        <Building size={14} />
                        <span style={{ fontWeight: 600 }}>{item.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Period */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      className="neumorph-inset-sm"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      <Calendar size={13} />
                      <span>{item.period || `${item.from || "2023"} - ${item.to || "Present"}`}</span>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => openEditModal(item)}
                        className="btn-neumorph"
                        style={{ padding: "6px 10px" }}
                        title="Edit Milestone"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item._id || item.id)}
                        className="btn-neumorph-danger"
                        style={{ padding: "6px 10px" }}
                        title="Delete Milestone"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "var(--admin-text-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                  }}
                >
                  {item.description}
                </p>

                {/* Tags / Skills Highlight */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {itemTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 8,
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
            </div>
          );
        })}

        {/* Dashed Add Card matching Screenshot 4 */}
        <div
          onClick={openAddModal}
          className="neumorph-card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: 24,
            cursor: "pointer",
            border: "2px dashed var(--admin-border-accent)",
          }}
        >
          <div
            className="neumorph-inset-sm"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-accent)",
            }}
          >
            <Plus size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              + Add New Milestone
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
              Add work experience, education, or any other milestone to your timeline.
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Milestone Modal */}
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
                {editingItem ? "Edit Timeline Milestone" : "Add Career Milestone"}
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
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="neumorph-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="work">Work Experience</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Role / Degree Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Developer or Bachelor of Technology"
                  className="neumorph-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company / Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tech Solutions Inc."
                    className="neumorph-input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Period</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - Present"
                    className="neumorph-input"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Key Technologies / Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Redux, Node.js"
                  className="neumorph-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Achievements</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Highlight core responsibilities, key features delivered, and architectural contributions..."
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
                  disabled={saveMutation.isPending}
                  className="btn-neumorph-primary"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingItem
                    ? "Save Changes"
                    : "Add Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTimeline;
