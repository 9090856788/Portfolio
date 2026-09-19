import React, { useState } from "react";
import {
  X,
  History,
  RotateCcw,
  Copy,
  Plus,
  Check,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function VersionHistoryModal({
  isOpen,
  onClose,
  resume,
  onRestoreVersion,
  onSaveSnapshot,
}) {
  const [note, setNote] = useState("");
  const versions = resume?.versions || [];

  if (!isOpen) return null;

  const handleCreateSnapshot = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    onSaveSnapshot(note.trim());
    setNote("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="neumorph-card"
        style={{
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px 28px",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 16,
            borderBottom: "var(--admin-border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--admin-accent-gradient)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <History size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                Version History & Snapshots
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Keep track of major iterations and roll back anytime without data loss.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Create Milestone Form */}
        <form onSubmit={handleCreateSnapshot} style={{ margin: "16px 0 10px", display: "flex", gap: 10 }}>
          <input
            type="text"
            className="neumorph-input"
            placeholder="Name milestone (e.g., Applied to FinTech, React Native Emphasis)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ flex: 1, fontSize: "0.86rem" }}
          />
          <button type="submit" disabled={!note.trim()} className="btn-neumorph-primary" style={{ padding: "0 18px", gap: 6 }}>
            <Plus size={15} />
            <span>Save Snapshot</span>
          </button>
        </form>

        {/* Versions Timeline */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 4px", display: "flex", flexDirection: "column", gap: 12 }}>
          {versions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--admin-text-muted)" }}>
              <History size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
              <p style={{ fontSize: "0.85rem", margin: 0 }}>No previous snapshots recorded yet.</p>
              <p style={{ fontSize: "0.75rem", margin: "4px 0 0" }}>
                Save a milestone above to lock in a rollback checkpoint.
              </p>
            </div>
          ) : (
            versions.map((ver, idx) => (
              <div
                key={ver.id || idx}
                className="neumorph-card-sm"
                style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(99, 102, 241, 0.15)",
                        color: "var(--admin-accent)",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      v{ver.version || idx + 1}.0
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--admin-text-primary)" }}>
                      {ver.note || "Resume Milestone"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "var(--admin-text-muted)", marginTop: 4 }}>
                    <Calendar size={12} />
                    <span>{ver.timestamp ? new Date(ver.timestamp).toLocaleString() : "Recently"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      onRestoreVersion(ver);
                      onClose();
                    }}
                    className="btn-neumorph"
                    style={{ padding: "6px 12px", fontSize: "0.78rem", gap: 4 }}
                    title="Restore this state"
                  >
                    <RotateCcw size={13} color="var(--admin-accent)" />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 16,
            borderTop: "var(--admin-border)",
            marginTop: 10,
          }}
        >
          <button onClick={onClose} className="btn-neumorph" style={{ padding: "8px 20px" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
