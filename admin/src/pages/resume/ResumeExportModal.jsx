import React, { useState } from "react";
import {
  X,
  FileDown,
  Printer,
  FileCode,
  FileText,
  Copy,
  Check,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";

export default function ResumeExportModal({
  isOpen,
  onClose,
  resume,
  onTriggerPrint,
  onImportJson,
}) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("pdf"); // 'pdf', 'json', 'txt'

  if (!isOpen || !resume) return null;

  const candidateName = (resume.personalInfo?.fullName || "Kanhu_Charan_Sahoo").replace(/\s+/g, "_");
  const versionTitle = (resume.title || "Resume").replace(/\s+/g, "_");
  const suggestedFileName = `${candidateName}_${versionTitle}.pdf`;

  // Generate plain text version for copy-pasting
  const generatePlainText = () => {
    const p = resume.personalInfo || {};
    const lines = [];

    lines.push(p.fullName?.toUpperCase() || "KANHU CHARAN SAHOO");
    lines.push(p.professionalTitle || "Senior Frontend Developer");
    lines.push([p.email, p.phone, p.location].filter(Boolean).join(" | "));
    if (p.linkedin || p.linkedIn) lines.push(`LinkedIn: ${p.linkedIn || p.linkedin}`);
    if (p.github) lines.push(`GitHub: ${p.github}`);
    if (p.website) lines.push(`Portfolio: ${p.website}`);
    lines.push("");

    if (resume.summary) {
      lines.push("PROFESSIONAL SUMMARY");
      lines.push("----------------------------------------");
      lines.push(resume.summary);
      lines.push("");
    }

    if (resume.experience?.length > 0) {
      lines.push("WORK EXPERIENCE");
      lines.push("----------------------------------------");
      resume.experience.forEach((exp) => {
        lines.push(`${exp.role} — ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})`);
        if (exp.location) lines.push(exp.location);
        (exp.highlights || []).forEach((h) => lines.push(`• ${h}`));
        lines.push("");
      });
    }

    if (resume.skills?.length > 0) {
      lines.push("TECHNICAL SKILLS");
      lines.push("----------------------------------------");
      lines.push(resume.skills.map((s) => s.name).join(", "));
      lines.push("");
    }

    if (resume.projects?.length > 0) {
      lines.push("KEY PROJECTS");
      lines.push("----------------------------------------");
      resume.projects.forEach((proj) => {
        lines.push(`${proj.title} ${proj.role ? `(${proj.role})` : ""}`);
        if (proj.techStack) lines.push(`Tech Stack: ${proj.techStack}`);
        if (proj.link) lines.push(`Link: ${proj.link}`);
        if (proj.description) lines.push(proj.description);
        (proj.highlights || []).forEach((h) => lines.push(`• ${h}`));
        lines.push("");
      });
    }

    if (resume.education?.length > 0) {
      lines.push("EDUCATION");
      lines.push("----------------------------------------");
      resume.education.forEach((edu) => {
        lines.push(`${edu.degree} — ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`);
        if (edu.grade) lines.push(edu.grade);
        (edu.highlights || []).forEach((h) => lines.push(`• ${h}`));
        lines.push("");
      });
    }

    if (resume.certifications?.length > 0) {
      lines.push("CERTIFICATIONS");
      lines.push("----------------------------------------");
      resume.certifications.forEach((c) => {
        lines.push(`${c.name} — ${c.issuer} (${c.issueDate || ""})`);
        if (c.link) lines.push(c.link);
      });
      lines.push("");
    }

    if (resume.achievements?.length > 0) {
      lines.push("KEY ACHIEVEMENTS");
      lines.push("----------------------------------------");
      resume.achievements.forEach((a) => {
        lines.push(`• ${a.title}: ${a.description}`);
      });
      lines.push("");
    }

    if (resume.languages?.length > 0) {
      lines.push("LANGUAGES");
      lines.push("----------------------------------------");
      lines.push(resume.languages.map((l) => `${l.name} (${l.proficiency})`).join(", "));
      lines.push("");
    }

    return lines.join("\n");
  };

  const plainTextContent = generatePlainText();
  const [importError, setImportError] = useState("");

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(plainTextContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([plainTextContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateName}_${versionTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const p = resume.personalInfo || {};
    const accent = resume.customization?.accentColor || "#4f46e5";
    const fontFamily = resume.customization?.fontFamily || "Plus Jakarta Sans";
    const container = document.getElementById("printable-resume-container");
    const resumeInner = container ? container.innerHTML : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.fullName || "Kanhu Charan Sahoo"} - ${resume.title || "Resume"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px 0;
      background: #f1f5f9;
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .print-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
    }
    .btn-print {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      background: ${accent};
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .resume-a4-page {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin: 0 auto;
      box-sizing: border-box;
      padding: 16mm;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .print-bar { display: none !important; }
      .resume-a4-page { box-shadow: none; margin: 0; width: 210mm; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">
      🖨 Print / Save as PDF
    </button>
  </div>
  ${resumeInner || `<div class="resume-a4-page"><h1>${p.fullName}</h1></div>`}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateName}_${versionTitle}_Printable.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateName}_${versionTitle}_Data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadJson = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportError("");
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result);
          onImportJson(parsed);
          onClose();
        } catch (err) {
          setImportError("Invalid JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    }
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
          maxWidth: 620,
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
              <FileDown size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                Export & Download Resume
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Selectable vector PDF, ATS Plain Text, or complete JSON backup.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "4px",
            background: "var(--admin-inset-bg)",
            borderRadius: 12,
            margin: "18px 0 14px",
          }}
        >
          <button
            onClick={() => setTab("pdf")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              background: tab === "pdf" ? "var(--admin-accent-gradient)" : "transparent",
              color: tab === "pdf" ? "#fff" : "var(--admin-text-secondary)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Printer size={14} />
            <span>PDF / Print</span>
          </button>

          <button
            onClick={() => setTab("txt")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              background: tab === "txt" ? "var(--admin-accent-gradient)" : "transparent",
              color: tab === "txt" ? "#fff" : "var(--admin-text-secondary)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FileText size={14} />
            <span>Plain Text (TXT)</span>
          </button>

          <button
            onClick={() => setTab("json")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              background: tab === "json" ? "var(--admin-accent-gradient)" : "transparent",
              color: tab === "json" ? "#fff" : "var(--admin-text-secondary)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FileCode size={14} />
            <span>JSON Backup</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 2px" }}>
          {tab === "pdf" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                className="neumorph-inset-sm"
                style={{ padding: "16px 18px", borderRadius: 14 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
                    Suggested File Name:
                  </span>
                  <span className="ats-badge">Vector A4 PDF</span>
                </div>
                <code style={{ fontSize: "0.85rem", color: "var(--admin-accent)", fontWeight: 600 }}>
                  {suggestedFileName}
                </code>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.82rem", color: "var(--admin-text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={16} color="#10b981" />
                  <span>Selectable text with working hyperlink tags</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={16} color="#10b981" />
                  <span>100% vector typography matching A4 sheet specs</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={16} color="#10b981" />
                  <span>Admin workspace UI is cleanly stripped during printing</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => onTriggerPrint(), 150);
                  }}
                  className="btn-neumorph-primary"
                  style={{ padding: "12px", width: "100%", justifyContent: "center", gap: 8 }}
                >
                  <Printer size={18} />
                  <span>Open Print & Save as PDF Dialog</span>
                </button>

                <button
                  onClick={handleDownloadHtml}
                  className="btn-neumorph"
                  style={{ padding: "11px", width: "100%", justifyContent: "center", gap: 8, fontSize: "0.82rem" }}
                >
                  <FileCode size={16} color="var(--admin-accent)" />
                  <span>Download Standalone Printable HTML (.html)</span>
                </button>
              </div>
            </div>
          )}

          {tab === "txt" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--admin-text-muted)" }}>
                  Ideal for pasting directly into ATS text fields or job portal forms.
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleCopyPlainText}
                    className="btn-neumorph"
                    style={{ padding: "6px 12px", fontSize: "0.78rem", gap: 6 }}
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="btn-neumorph-primary"
                    style={{ padding: "6px 12px", fontSize: "0.78rem", gap: 6 }}
                  >
                    <Download size={14} />
                    <span>Download .txt</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={plainTextContent}
                className="neumorph-input"
                rows={10}
                style={{ fontFamily: "monospace", fontSize: "0.78rem", resize: "none" }}
              />
            </div>
          )}

          {tab === "json" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: "0.82rem", color: "var(--admin-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Export your structured resume data as a standard JSON schema to migrate or back up your configuration. You can also restore this resume anytime.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button
                  onClick={handleDownloadJson}
                  className="btn-neumorph-primary"
                  style={{ padding: "12px", justifyContent: "center", gap: 8 }}
                >
                  <Download size={16} />
                  <span>Download JSON</span>
                </button>

                <label
                  className="btn-neumorph"
                  style={{ padding: "12px", justifyContent: "center", gap: 8, cursor: "pointer" }}
                >
                  <Upload size={16} color="var(--admin-accent)" />
                  <span>Import JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={handleUploadJson}
                  />
                </label>
              </div>

              {importError && (
                <div style={{ padding: "8px 12px", background: "rgba(239, 68, 68, 0.12)", color: "#ef4444", borderRadius: 8, fontSize: "0.8rem", fontWeight: 600 }}>
                  {importError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 16,
            borderTop: "var(--admin-border)",
            marginTop: 14,
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
