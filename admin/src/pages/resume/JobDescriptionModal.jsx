import React, { useState } from "react";
import {
  X,
  Target,
  Sparkles,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function JobDescriptionModal({
  isOpen,
  onClose,
  resume,
  onIncorporateKeywords,
}) {
  const [jobText, setJobText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [matches, setMatches] = useState([]);
  const [missing, setMissing] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState(0);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!jobText.trim()) return;

    // Common technical and engineering keywords pool
    const TECH_KEYWORDS = [
      "react", "typescript", "javascript", "redux", "tailwind", "next.js", "node.js",
      "html5", "css3", "git", "github", "rest api", "graphql", "webpack", "vite",
      "jest", "cypress", "ci/cd", "docker", "agile", "scrum", "performance",
      "responsive", "micro frontend", "state management", "accessibility", "wcag",
      "unit testing", "code review", "system architecture", "seo", "cloud"
    ];

    const lowerJob = jobText.toLowerCase();
    const resumeWords = [
      resume?.summary || "",
      ...(resume?.skills || []).map((s) => s.name),
      ...(resume?.experience || []).flatMap((e) => [e.role, ...(e.highlights || [])]),
      ...(resume?.projects || []).flatMap((p) => [p.title, p.techStack, p.description]),
    ].join(" ").toLowerCase();

    // Extract keywords present in job description
    const foundInJob = TECH_KEYWORDS.filter((kw) => lowerJob.includes(kw));

    const matchedList = [];
    const missingList = [];

    foundInJob.forEach((kw) => {
      if (resumeWords.includes(kw)) {
        matchedList.push(kw);
      } else {
        missingList.push(kw);
      }
    });

    const percent = foundInJob.length > 0
      ? Math.round((matchedList.length / foundInJob.length) * 100)
      : 80;

    setMatches(matchedList);
    setMissing(missingList);
    setMatchPercentage(percent);
    setAnalyzed(true);
  };

  const handleAddMissingKeyword = (keyword) => {
    // Add missing keyword as a skill in the resume
    onIncorporateKeywords(keyword);
    setMatches((prev) => [...prev, keyword]);
    setMissing((prev) => prev.filter((k) => k !== keyword));
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
          maxWidth: 680,
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
              <Target size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                Match With Job Description
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Target your resume to a specific job opening and analyze keyword overlap.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 2px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: 6 }}>
              Paste Job Description or Requirements:
            </label>
            <textarea
              className="neumorph-input"
              rows={5}
              placeholder="Paste the target role description, key qualifications, and required skills here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                onClick={handleAnalyze}
                disabled={!jobText.trim()}
                className="btn-neumorph-primary"
                style={{ padding: "8px 20px", gap: 6 }}
              >
                <Sparkles size={15} />
                <span>Analyze Keywords & Match</span>
              </button>
            </div>
          </div>

          {analyzed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Match Score Banner */}
              <div
                className="neumorph-inset-sm"
                style={{
                  padding: "16px 20px",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
                    Target Role Match Rate
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--admin-accent)" }}>
                    {matchPercentage}% Keyword Alignment
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: matchPercentage >= 75 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                    color: matchPercentage >= 75 ? "#10b981" : "#f59e0b",
                  }}
                >
                  {matchPercentage >= 75 ? "High Relevance" : "Moderate Alignment"}
                </span>
              </div>

              {/* Matched Keywords */}
              <div>
                <label className="form-label" style={{ fontSize: "0.82rem", color: "#10b981" }}>
                  ✓ Matched Keywords Found in Resume ({matches.length})
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {matches.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>None detected</span>
                  ) : (
                    matches.map((kw) => (
                      <span
                        key={kw}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: "rgba(16,185,129,0.12)",
                          color: "#10b981",
                          border: "1px solid rgba(16,185,129,0.3)",
                        }}
                      >
                        {kw}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing High Impact Keywords */}
              <div>
                <label className="form-label" style={{ fontSize: "0.82rem", color: "#f59e0b" }}>
                  + High-Impact Keywords Mentioned in Job Post ({missing.length})
                </label>
                <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", margin: "0 0 8px" }}>
                  Click to add any relevant skills you possess directly to this resume version:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {missing.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>
                      All target keywords are present in your resume!
                    </span>
                  ) : (
                    missing.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => handleAddMissingKeyword(kw)}
                        className="btn-neumorph"
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          gap: 6,
                          borderColor: "rgba(245,158,11,0.3)",
                        }}
                        title="Add to skills"
                      >
                        <Plus size={12} color="var(--admin-accent)" />
                        <span>{kw}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
