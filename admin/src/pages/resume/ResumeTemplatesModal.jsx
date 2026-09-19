import React, { useState } from "react";
import { X, Check, Sparkles, Download, Palette, Type, Sliders } from "lucide-react";
import { TEMPLATES_CONFIG } from "./ResumeTemplates";

const COLOR_PRESETS = [
  { name: "Indigo Pro", value: "#4f46e5" },
  { name: "Emerald Tech", value: "#059669" },
  { name: "Sapphire Corporate", value: "#0284c7" },
  { name: "Slate Minimal", value: "#334155" },
  { name: "Violet Modern", value: "#7c3aed" },
  { name: "Crimson Executive", value: "#dc2626" },
  { name: "Teal Modern", value: "#0d9488" },
  { name: "Charcoal Dark", value: "#1e293b" },
];

const FONT_OPTIONS = [
  { name: "Plus Jakarta Sans", desc: "Modern, clean geometric sans" },
  { name: "Inter", desc: "Highly legible neutral sans" },
  { name: "Roboto", desc: "Industry standard tech sans" },
  { name: "Arial", desc: "Universal system ATS font" },
  { name: "Merriweather", desc: "Warm, distinguished serif" },
];

export default function ResumeTemplatesModal({
  isOpen,
  onClose,
  resume,
  onApplyCustomization,
  onDownloadPdf,
}) {
  if (!isOpen) return null;

  const currentTemplateId = resume?.templateId || "modern-pro";
  const currentCustomization = resume?.customization || {};

  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplateId);
  const [accentColor, setAccentColor] = useState(currentCustomization.accentColor || "#4f46e5");
  const [fontFamily, setFontFamily] = useState(currentCustomization.fontFamily || "Plus Jakarta Sans");
  const [fontSize, setFontSize] = useState(currentCustomization.fontSize || "10pt");
  const [lineSpacing, setLineSpacing] = useState(currentCustomization.lineSpacing || "1.45");
  const [marginSize, setMarginSize] = useState(currentCustomization.marginSize || "16mm");
  const [showPhoto, setShowPhoto] = useState(currentCustomization.showPhoto !== false);

  const handleApply = (downloadAfter = false) => {
    onApplyCustomization({
      templateId: selectedTemplate,
      customization: {
        accentColor,
        fontFamily,
        fontSize,
        lineSpacing,
        marginSize,
        showPhoto,
      },
    });

    if (downloadAfter) {
      setTimeout(() => {
        onDownloadPdf();
      }, 200);
    }
    onClose();
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
          maxWidth: 900,
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
              <Palette size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.18rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                Templates & Styling Controls
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Select an ATS-engineered layout and calibrate typography, accents, and margins.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 4px 10px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Templates Grid */}
          <div>
            <label className="form-label" style={{ marginBottom: 12, fontSize: "0.88rem" }}>
              1. Choose ATS-Engineered Template
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {TEMPLATES_CONFIG.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className="neumorph-card-sm"
                    style={{
                      padding: "16px",
                      borderRadius: 14,
                      cursor: "pointer",
                      border: isSelected ? "2px solid var(--admin-accent)" : "var(--admin-border)",
                      background: isSelected ? "var(--admin-inset-bg)" : "var(--admin-card-bg)",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span className="ats-badge">{tmpl.badge}</span>
                      {isSelected && (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "var(--admin-accent)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--admin-text-primary)", margin: "0 0 4px" }}>
                      {tmpl.name}
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "0 0 8px", lineHeight: 1.4 }}>
                      {tmpl.description}
                    </p>
                    <div style={{ fontSize: "0.72rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                      Best for: {tmpl.bestFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="form-label" style={{ marginBottom: 10, fontSize: "0.88rem" }}>
              2. Accent Color
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {COLOR_PRESETS.map((color) => {
                const isSelected = accentColor.toLowerCase() === color.value.toLowerCase();
                return (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color.value)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 12px",
                      borderRadius: 9999,
                      border: isSelected ? `2px solid ${color.value}` : "var(--admin-border)",
                      background: isSelected ? "var(--admin-inset-bg)" : "var(--admin-card-bg)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--admin-text-primary)",
                    }}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: color.value }} />
                    <span>{color.name}</span>
                  </button>
                );
              })}

              {/* Custom Color Picker Input */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ width: 28, height: 28, border: "none", borderRadius: 6, cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", fontFamily: "monospace" }}>
                  {accentColor}
                </span>
              </div>
            </div>
          </div>

          {/* Typography & Spacing Options */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {/* Font Family */}
            <div>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>Font Family</label>
              <select
                className="neumorph-input"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>Base Font Size</label>
              <select
                className="neumorph-input"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="9pt">Small (9pt) — Compact</option>
                <option value="10pt">Standard (10pt) — Optimal</option>
                <option value="11pt">Large (11pt) — Spaced</option>
              </select>
            </div>

            {/* Line Spacing */}
            <div>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>Line Spacing</label>
              <select
                className="neumorph-input"
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value)}
              >
                <option value="1.3">Compact (1.3)</option>
                <option value="1.45">Standard (1.45)</option>
                <option value="1.6">Relaxed (1.6)</option>
              </select>
            </div>
          </div>

          {/* Margins & Photo Switch */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <div>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>Page Margins (A4)</label>
              <select
                className="neumorph-input"
                value={marginSize}
                onChange={(e) => setMarginSize(e.target.value)}
              >
                <option value="12mm">Compact (12mm) — Max Content</option>
                <option value="16mm">Standard (16mm) — Balanced</option>
                <option value="20mm">Generous (20mm) — Airy</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--admin-text-primary)" }}>
                  Include Profile Photo
                </span>
                <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", margin: 0 }}>
                  Non-ATS layouts show photo if provided
                </p>
              </div>
              <div
                onClick={() => setShowPhoto(!showPhoto)}
                className={`neumorph-toggle ${showPhoto ? "active" : ""}`}
              >
                <div className="neumorph-toggle-thumb" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
            borderTop: "var(--admin-border)",
          }}
        >
          <button onClick={onClose} className="btn-neumorph" style={{ padding: "8px 18px" }}>
            Cancel
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => handleApply(false)}
              className="btn-neumorph"
              style={{ padding: "8px 18px" }}
            >
              Apply Styles
            </button>
            <button
              onClick={() => handleApply(true)}
              className="btn-neumorph-primary"
              style={{ padding: "8px 20px", gap: 8 }}
            >
              <Download size={16} />
              <span>Apply & Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
