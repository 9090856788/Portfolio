import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTimeline, addTimeline, deleteTimeline } from "../api/adminApi";
import { Plus, Trash2, Briefcase, GraduationCap, CheckCircle, AlertCircle, X } from "lucide-react";

const ManageTimeline = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState(null);

  const { data: timeline = [], isLoading } = useQuery({
    queryKey: ["adminTimeline"],
    queryFn: fetchTimeline,
  });

  const addMutation = useMutation({
    mutationFn: addTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      setNotice({ type: "success", text: "Timeline milestone added!" });
      setTitle("");
      setCompany("");
      setPeriod("");
      setDescription("");
      setModalOpen(false);
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to add milestone" });
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

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    addMutation.mutate({
      title,
      company,
      period: period || "2023 - Present",
      description,
      from: period.split("-")[0]?.trim() || "2023",
      to: period.split("-")[1]?.trim() || "Present",
    });
  };

  return (
    <div className="content-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>Manage Timeline</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Add and manage career milestones, work experience, and educational background.
          </p>
        </div>
        <button id="btn-add-new-milestone" onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Milestone</span>
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

      {isLoading ? (
        <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading timeline...</div>
      ) : (
        <div className="grid-2">
          {timeline.map((item) => {
            const isEdu =
              item.title?.toLowerCase().includes("degree") ||
              item.title?.toLowerCase().includes("bachelor") ||
              item.company?.toLowerCase().includes("university");
            return (
              <div key={item._id} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: isEdu ? "rgba(245, 158, 11, 0.15)" : "rgba(99, 102, 241, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: isEdu ? "#fbbf24" : "#818cf8" }}>
                        {isEdu ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{item.title}</h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>
                          {item.company}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.78rem", padding: "3px 8px", borderRadius: 6, background: "rgba(255, 255, 255, 0.06)", color: "var(--text-secondary)" }}>
                      {item.period || `${item.timeline?.from || ""} - ${item.timeline?.to || ""}`}
                    </span>
                  </div>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.5, marginTop: 8 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, borderTop: "1px solid var(--border-color)", paddingTop: 12 }}>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete milestone "${item.title}"?`)) {
                        deleteMutation.mutate(item._id);
                      }
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Add Milestone</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Title / Role / Degree *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer or B.Tech CSE"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Institution</label>
                <input
                  type="text"
                  placeholder="e.g. Tech Corp or University"
                  className="form-control"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Period / Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2022 - Present or 2019 - 2023"
                  className="form-control"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize key responsibilities, achievements, or academic coursework..."
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={addMutation.isPending} className="btn btn-primary">
                  {addMutation.isPending ? "Adding..." : "Add Milestone"}
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
