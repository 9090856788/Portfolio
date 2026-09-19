import React from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function AtsQualityModal({ isOpen, onClose, resume }) {
  if (!isOpen || !resume) return null;

  const {
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = resume;

  // Evaluate checklist items
  const checks = [
    {
      id: "contact",
      label: "Full Contact Information",
      passed: Boolean(
        personalInfo.fullName &&
        personalInfo.email &&
        personalInfo.phone &&
        personalInfo.location
      ),
      weight: 15,
      detail: "Full Name, Email, Phone, and Location are required for recruiter reachouts.",
      suggestion: "Make sure your location and email are formatted cleanly without extraneous punctuation.",
    },
    {
      id: "links",
      label: "Portfolio & Social Proof Links",
      passed: Boolean(personalInfo.github || personalInfo.linkedIn || personalInfo.website),
      weight: 10,
      detail: "Working links to GitHub, LinkedIn, or personal portfolio establish engineering credibility.",
      suggestion: "Ensure URLs point directly to active profiles.",
    },
    {
      id: "summary",
      label: "Impactful Summary Statement",
      passed: summary.length >= 80 && summary.length <= 600,
      weight: 15,
      detail: "A concise 2-4 sentence summary outlining your seniority, core stack, and focus.",
      suggestion: summary.length < 80 ? "Expand your summary to clearly state your key frameworks and years in engineering." : "Keep summary under 600 characters for high recruiter scan speed.",
    },
    {
      id: "experience",
      label: "Chronological Work Experience",
      passed: experience.length >= 1 && experience.some((e) => e.highlights && e.highlights.length > 0),
      weight: 25,
      detail: "Role, company name, dates, and bullet points describing quantifiable deliverables.",
      suggestion: "Start bullet points with strong action verbs (e.g. 'Architected', 'Spearheaded', 'Optimized').",
    },
    {
      id: "metrics",
      label: "Measurable Impact & Metrics in Highlights",
      passed: experience.some((e) =>
        (e.highlights || []).some((h) =>
          /\d+%|\d+x|\$\d+|\bms\b|\bsec\b|\bmillion\b|\bthousand\b|\bteam\b/i.test(h)
        )
      ),
      weight: 10,
      detail: "Quantitative numbers (e.g. 'improved performance by 40%', 'reduced bundle by 25%').",
      suggestion: "Include metrics in at least 2 experience bullets to demonstrate concrete business impact.",
    },
    {
      id: "skills",
      label: "Technical Stack & Categorized Skills",
      passed: skills.length >= 6,
      weight: 15,
      detail: "Comprehensive list of core programming languages, frameworks, and modern libraries.",
      suggestion: skills.length < 6 ? "Add more core frameworks (e.g., React, TypeScript, Redux, Tailwind CSS)." : "Well rounded skill collection.",
    },
    {
      id: "education",
      label: "Education & Degree Accreditation",
      passed: education.length >= 1 && education.some((e) => e.degree && e.institution),
      weight: 10,
      detail: "Formal degree or diploma with university name and graduation timeline.",
      suggestion: "Add your latest degree and graduation dates.",
    },
  ];

  const totalScore = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0);

  const getScoreColor = () => {
    if (totalScore >= 85) return "#10b981"; // Emerald
    if (totalScore >= 70) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const circumference = 2 * Math.PI * 46;
  const strokeOffset = circumference - (totalScore / 100) * circumference;

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
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                ATS Compliance & Quality Score
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Machine readability, parse validation, and recruiter presentation score.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 2px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Gauge Banner */}
          <div
            className="neumorph-inset-sm"
            style={{
              padding: "20px",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              gap: 20,
            }}
          >
            {/* Circular Gauge */}
            <div style={{ position: "relative", width: 110, height: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  stroke={getScoreColor()}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="quality-meter-circle"
                />
              </svg>

              <div style={{ position: "absolute", textAlign: "center" }}>
                <span style={{ fontSize: "1.55rem", fontWeight: 800, color: "var(--admin-text-primary)" }}>
                  {totalScore}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>/100</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 9999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: totalScore >= 85 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                    color: getScoreColor(),
                  }}
                >
                  {totalScore >= 85 ? "Excellent ATS Readiness" : "Good — Minor Improvements"}
                </span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--admin-text-primary)", margin: "4px 0" }}>
                Parser Scan Compatibility
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--admin-text-secondary)", margin: 0, lineHeight: 1.45 }}>
                Standard ATS engines (Workday, Greenhouse, Lever, Taleo) easily extract sections, titles, and dates.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--admin-text-primary)", marginBottom: 10 }}>
              ATS Quality Checklist
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {checks.map((item) => (
                <div
                  key={item.id}
                  className="neumorph-card-sm"
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    {item.passed ? (
                      <CheckCircle2 size={18} color="#10b981" />
                    ) : (
                      <AlertTriangle size={18} color="#f59e0b" />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: "0.74rem", fontWeight: 600, color: item.passed ? "#10b981" : "#f59e0b" }}>
                        {item.passed ? `+${item.weight} pts` : `0 / ${item.weight} pts`}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.76rem", color: "var(--admin-text-secondary)", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.detail}
                    </p>

                    {!item.passed && (
                      <p style={{ fontSize: "0.74rem", color: "var(--admin-accent)", margin: "4px 0 0", fontWeight: 600 }}>
                        Tip: {item.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <button onClick={onClose} className="btn-neumorph-primary" style={{ padding: "8px 24px" }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
