import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSkills, addSkill, updateSkill, deleteSkill } from "../api/adminApi";
import {
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const ManageSkills = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState(85);
  const [svgUrl, setSvgUrl] = useState("");
  const [notice, setNotice] = useState(null);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: fetchSkills,
  });

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Skill added successfully!" });
      setTitle("");
      setProficiency(85);
      setSvgUrl("");
      setModalOpen(false);
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to add skill" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, prof }) => updateSkill(id, prof),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Proficiency updated!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Skill removed!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addMutation.mutate({
      title,
      proficiency: Number(proficiency),
      svgUrl: svgUrl || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    });
  };

  return (
    <div className="content-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>Manage Skills</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Add and calibrate your technical skill proficiencies displayed on your portfolio resume.
          </p>
        </div>
        <button id="btn-add-new-skill" onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Skill</span>
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

      {/* Skills Grid */}
      {isLoading ? (
        <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading skills...</div>
      ) : (
        <div className="grid-2">
          {skills.map((skill) => (
            <div key={skill._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {skill.svg?.url ? (
                    <img src={skill.svg.url} alt="" style={{ width: 26, height: 26 }} />
                  ) : (
                    <Sparkles size={20} color="var(--accent-primary)" />
                  )}
                  <span style={{ fontSize: "1.05rem", fontWeight: 600 }}>{skill.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                    {skill.proficiency}%
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete skill "${skill.title}"?`)) {
                        deleteMutation.mutate(skill._id);
                      }
                    }}
                    className="btn btn-danger btn-sm"
                    style={{ padding: "4px 8px" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Range Slider for Instant Calibration */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="range"
                  min="10"
                  max="100"
                  defaultValue={skill.proficiency}
                  onChange={(e) => {
                    updateMutation.mutate({ id: skill._id, prof: Number(e.target.value) });
                  }}
                  style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Add Technical Skill</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, TypeScript, Next.js"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Proficiency Level: {proficiency}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  className="form-control"
                  style={{ cursor: "pointer", accentColor: "var(--accent-primary)" }}
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon / SVG URL</label>
                <input
                  type="url"
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                  className="form-control"
                  value={svgUrl}
                  onChange={(e) => setSvgUrl(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={addMutation.isPending} className="btn btn-primary">
                  {addMutation.isPending ? "Adding..." : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSkills;
