import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
} from "lucide-react";

export const TEMPLATES_CONFIG = [
  {
    id: "modern-pro",
    name: "Modern Professional",
    description: "Sleek accent bar header with high readability and balanced multi-column information hierarchy.",
    badge: "ATS-Ready",
    bestFor: "Software Engineers, Tech Leads, Senior Frontend",
    thumbnailAccent: "#4f46e5",
  },
  {
    id: "minimal-ats",
    name: "Minimal ATS",
    description: "High-contrast, strict single-column layout engineered for seamless machine parsing across enterprise ATS platforms.",
    badge: "ATS-Friendly",
    bestFor: "Enterprise Companies, Banks, Standard Portals",
    thumbnailAccent: "#334155",
  },
  {
    id: "technical-dev",
    name: "Technical Developer",
    description: "Emphasizes technical stack, categorized skills, GitHub repositories, and system architecture achievements.",
    badge: "ATS-Ready",
    bestFor: "Full-Stack, DevOps, React / Node Specialists",
    thumbnailAccent: "#059669",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated typography and refined divider lines suited for seasoned leaders and architects.",
    badge: "ATS-Friendly",
    bestFor: "Engineering Managers, Architects, Consultants",
    thumbnailAccent: "#7c3aed",
  },
  {
    id: "clean-corporate",
    name: "Clean Corporate",
    description: "Formal structured sections with shaded header labels, clear timelines, and disciplined spacing.",
    badge: "ATS-Ready",
    bestFor: "Consulting, Enterprise Roles, Tech Advisory",
    thumbnailAccent: "#0284c7",
  },
  {
    id: "compact-one-page",
    name: "Compact One Page",
    description: "High information density with compact spacing, designed to present deep experience within a crisp single page.",
    badge: "ATS-Friendly",
    bestFor: "Fast Scans, Hiring Events, Direct Executive Referrals",
    thumbnailAccent: "#dc2626",
  },
];

/**
 * Renders the resume contents according to the selected template.
 * Pure vector typography and styled HTML that generates selectable text and working links.
 */
export function ResumeDocument({ resume, scale = 1, isPrint = false }) {
  if (!resume) return null;

  const {
    templateId = "modern-pro",
    customization = {},
    personalInfo = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    languages = [],
    interests = [],
    customSections = [],
    sectionsOrder = [
      "personal",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "achievements",
      "languages",
    ],
    sectionsVisibility = {},
  } = resume;

  const accent = customization.accentColor || "#4f46e5";
  const fontFamily = customization.fontFamily || "Plus Jakarta Sans";
  const fontSize = customization.fontSize || "10pt";
  const lineSpacing = customization.lineSpacing || "1.45";
  const marginSize = customization.marginSize || "16mm";
  const showPhoto = customization.showPhoto !== false;

  const fontStyle = {
    fontFamily: `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    fontSize: fontSize,
    lineHeight: lineSpacing,
    color: "#1e293b",
  };

  // Helper to check visibility
  const isVisible = (secKey) => sectionsVisibility[secKey] !== false;

  // Render individual sections
  const renderSection = (secKey) => {
    if (!isVisible(secKey)) return null;

    switch (secKey) {
      case "summary":
        if (!summary) return null;
        return (
          <div key="summary" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Professional Summary" accent={accent} templateId={templateId} />
            <p style={{ margin: "6px 0 0", color: "#334155", textAlign: "justify", fontSize: "0.95em" }}>
              {summary}
            </p>
          </div>
        );

      case "experience":
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Work Experience" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
              {experience.map((exp) => (
                <div key={exp.id || Math.random()} className="resume-entry" style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "1.05em", color: "#0f172a" }}>
                        {exp.role}
                      </span>
                      {exp.company && (
                        <span style={{ color: "#475569", fontWeight: 600, marginLeft: "6px" }}>
                          — {exp.company}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.85em", fontWeight: 600, color: "#64748b" }}>
                      {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ""}
                    </span>
                  </div>

                  {exp.location && (
                    <div style={{ fontSize: "0.82em", color: "#64748b", margin: "1px 0 4px" }}>
                      {exp.location}
                    </div>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "#334155", fontSize: "0.92em" }}>
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} style={{ marginBottom: "3px", lineHeight: "1.4" }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "education":
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Education" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {education.map((edu) => (
                <div key={edu.id || Math.random()} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "1em", color: "#0f172a" }}>
                        {edu.degree}
                      </span>
                      {edu.institution && (
                        <div style={{ color: "#475569", fontWeight: 500, fontSize: "0.92em" }}>
                          {edu.institution}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.85em", fontWeight: 600, color: "#64748b" }}>
                        {edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ""}
                      </span>
                      {edu.grade && (
                        <div style={{ fontSize: "0.82em", color: accent, fontWeight: 700 }}>
                          {edu.grade}
                        </div>
                      )}
                    </div>
                  </div>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul style={{ margin: "3px 0 0 16px", padding: 0, color: "#475569", fontSize: "0.88em" }}>
                      {edu.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        if (!skills || skills.length === 0) return null;
        return (
          <div key="skills" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Skills" accent={accent} templateId={templateId} />
            {templateId === "technical-dev" ? (
              // Tag pill layout
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {skills.map((sk) => (
                  <span
                    key={sk.id || sk.name}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      fontSize: "0.88em",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            ) : (
              // Linear bullet or inline list for high ATS readability
              <div style={{ marginTop: "6px", fontSize: "0.92em", color: "#334155", lineHeight: "1.5" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px 12px" }}>
                  {skills.map((sk) => (
                    <div key={sk.id || sk.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: accent }} />
                      <span>{sk.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "projects":
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Projects" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              {projects.map((proj) => (
                <div key={proj.id || proj.title} style={{ pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "1em", color: "#0f172a" }}>
                        {proj.title}
                      </span>
                      {proj.role && (
                        <span style={{ color: "#64748b", fontSize: "0.88em", marginLeft: "6px" }}>
                          ({proj.role})
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: "0.82em",
                          color: accent,
                          textDecoration: "none",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <span>Link</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                  {proj.techStack && (
                    <div style={{ fontSize: "0.82em", color: "#64748b", fontWeight: 600, margin: "1px 0" }}>
                      Tech: {proj.techStack}
                    </div>
                  )}
                  {proj.description && (
                    <p style={{ margin: "2px 0 0", fontSize: "0.9em", color: "#334155" }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul style={{ margin: "3px 0 0 16px", padding: 0, color: "#475569", fontSize: "0.88em" }}>
                      {proj.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "certifications":
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Certifications" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {certifications.map((c) => (
                <div key={c.id || c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95em", color: "#0f172a" }}>{c.name}</span>
                    {c.issuer && <span style={{ color: "#64748b", fontSize: "0.88em", marginLeft: "6px" }}>— {c.issuer}</span>}
                  </div>
                  {c.issueDate && <span style={{ fontSize: "0.85em", color: "#64748b", fontWeight: 600 }}>{c.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case "achievements":
        if (!achievements || achievements.length === 0) return null;
        return (
          <div key="achievements" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Key Achievements" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {achievements.map((ach) => (
                <div key={ach.id || ach.title} style={{ fontSize: "0.92em" }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{ach.title}: </span>
                  <span style={{ color: "#334155" }}>{ach.description}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "languages":
        if (!languages || languages.length === 0) return null;
        return (
          <div key="languages" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Languages" accent={accent} templateId={templateId} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "6px", fontSize: "0.92em" }}>
              {languages.map((l) => (
                <div key={l.id || l.name}>
                  <strong style={{ color: "#0f172a" }}>{l.name}</strong>
                  {l.proficiency && <span style={{ color: "#64748b", marginLeft: "4px" }}>({l.proficiency})</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case "interests":
        if (!interests || interests.length === 0) return null;
        return (
          <div key="interests" className="resume-section" style={{ marginBottom: "16px" }}>
            <SectionHeader title="Interests & Passions" accent={accent} templateId={templateId} />
            <p style={{ margin: "6px 0 0", color: "#334155", fontSize: "0.92em" }}>
              {interests.join(" • ")}
            </p>
          </div>
        );

      case "custom":
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom" className="resume-section" style={{ marginBottom: "16px" }}>
            {customSections.map((cs) => (
              <div key={cs.id || cs.title} style={{ marginBottom: "14px" }}>
                <SectionHeader title={cs.title || "Custom Section"} accent={accent} templateId={templateId} />
                <div style={{ marginTop: "8px", fontSize: "0.92em", color: "#334155" }}>
                  {cs.content || cs.description}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="resume-a4-page"
      style={{
        ...fontStyle,
        padding: marginSize,
      }}
    >
      {/* Header: Personal Information */}
      <HeaderSection
        personalInfo={personalInfo}
        accent={accent}
        templateId={templateId}
        showPhoto={showPhoto}
      />

      {/* Render Dynamic Sections In Specified Order */}
      <div style={{ marginTop: "16px" }}>
        {sectionsOrder.map((secKey) => (secKey !== "personal" ? renderSection(secKey) : null))}
      </div>
    </div>
  );
}

/**
 * Section Header Component styled based on the template variant
 */
function SectionHeader({ title, accent, templateId }) {
  if (templateId === "minimal-ats") {
    return (
      <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "6px" }}>
        <h2
          style={{
            fontSize: "1.05em",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#0f172a",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (templateId === "clean-corporate") {
    return (
      <div
        style={{
          background: "#f1f5f9",
          padding: "4px 8px",
          borderLeft: `4px solid ${accent}`,
          marginBottom: "6px",
        }}
      >
        <h2
          style={{
            fontSize: "0.98em",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#1e293b",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    );
  }

  if (templateId === "executive") {
    return (
      <div style={{ marginBottom: "8px", borderBottom: `2px solid ${accent}`, paddingBottom: "4px" }}>
        <h2
          style={{
            fontSize: "1.08em",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: accent,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    );
  }

  // Default Modern / Technical / Compact
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderBottom: "1.5px solid #e2e8f0",
        paddingBottom: "4px",
        marginBottom: "6px",
      }}
    >
      <h2
        style={{
          fontSize: "1.02em",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: accent,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

/**
 * Header with personal contact details, links, title, and optional photo
 */
function HeaderSection({ personalInfo, accent, templateId, showPhoto }) {
  const {
    fullName = "Kanhu Charan Sahoo",
    professionalTitle = "Senior Frontend Developer",
    email = "kanhucharansahoo595@gmail.com",
    phone = "+91 9090856788",
    location = "Bhubaneswar, Odisha",
    website = "https://kanhustudio.dev",
    linkedIn = "https://linkedin.com/in/kanhucharansahoo",
    github = "https://github.com/0908563188",
    photoUrl = "",
  } = personalInfo;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        paddingBottom: "12px",
        borderBottom: templateId === "minimal-ats" ? "2px solid #0f172a" : `3px solid ${accent}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "1.85em",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            margin: 0,
            lineHeight: 1.15,
            textTransform: templateId === "minimal-ats" ? "uppercase" : "none",
          }}
        >
          {fullName}
        </h1>

        <div
          style={{
            fontSize: "1.12em",
            fontWeight: 600,
            color: accent,
            marginTop: "4px",
            marginBottom: "10px",
          }}
        >
          {professionalTitle}
        </div>

        {/* Contact Links Bar (Selectable & Clickable) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 16px",
            fontSize: "0.84em",
            color: "#475569",
            alignItems: "center",
          }}
        >
          {location && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <MapPin size={12} color="#64748b" />
              <span>{location}</span>
            </span>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#475569",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Phone size={12} color="#64748b" />
              <span>{phone}</span>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: accent,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <Mail size={12} color={accent} />
              <span>{email}</span>
            </a>
          )}

          {linkedIn && (
            <a
              href={linkedIn.startsWith("http") ? linkedIn : `https://${linkedIn}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#475569",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Linkedin size={12} color="#0077b5" />
              <span>{linkedIn.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "in/")}</span>
            </a>
          )}

          {github && (
            <a
              href={github.startsWith("http") ? github : `https://${github}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#475569",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Github size={12} color="#24292e" />
              <span>{github.replace(/^https?:\/\/(www\.)?github\.com\//, "gh/")}</span>
            </a>
          )}

          {website && (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color: "#475569",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Globe size={12} color="#64748b" />
              <span>{website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>
      </div>

      {/* Profile Photo if enabled and provided */}
      {showPhoto && photoUrl && templateId !== "minimal-ats" && (
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            border: "2px solid #ffffff",
            flexShrink: 0,
          }}
        >
          <img
            src={photoUrl}
            alt={fullName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
