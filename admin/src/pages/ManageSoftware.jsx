import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSoftware, addSoftware, deleteSoftware } from "../api/adminApi";
import { Plus, Trash2, Wrench, CheckCircle, AlertCircle, X } from "lucide-react";

const ManageSoftware = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [svgUrl, setSvgUrl] = useState("");
  const [notice, setNotice] = useState(null);

  const { data: software = [], isLoading } = useQuery({
    queryKey: ["adminSoftware"],
    queryFn: fetchSoftware,
  });

  const addMutation = useMutation({
    mutationFn: addSoftware,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSoftware"] });
      queryClient.invalidateQueries({ queryKey: ["software"] });
      setNotice({ type: "success", text: "Software tool added!" });
      setName("");
      setSvgUrl("");
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
      svgUrl: svgUrl || "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    });
  };

  return (
    <div className="content-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>Software Applications</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Manage developer tools, IDEs, and environments displayed on your portfolio.
          </p>
        </div>
        <button id="btn-add-new-software" onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Software</span>
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
        <div style={{ color: "var(--text-muted)", padding: 40, textAlign: "center" }}>Loading software tools...</div>
      ) : (
        <div className="grid-3">
          {software.map((tool) => (
            <div key={tool._id} className="glass-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {tool.svg?.url ? (
                  <img src={tool.svg.url} alt="" style={{ width: 32, height: 32 }} />
                ) : (
                  <Wrench size={22} color="var(--accent-primary)" />
                )}
                <span style={{ fontSize: "1rem", fontWeight: 600 }}>{tool.name}</span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${tool.name}"?`)) {
                    deleteMutation.mutate(tool._id);
                  }
                }}
                className="btn btn-danger btn-sm"
                style={{ padding: "6px 10px" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Add Software Application</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Application Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VS Code, Postman, Docker, Figma"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  {addMutation.isPending ? "Adding..." : "Add Software"}
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
