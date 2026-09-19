import React, { useState, useEffect } from "react";
import {
  X,
  DownloadCloud,
  Check,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Layers,
  AlertCircle,
} from "lucide-react";
import { fetchPortfolioSnapshot } from "../../api/adminApi";

export default function ImportPortfolioModal({
  isOpen,
  onClose,
  onResumeImported,
}) {
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [options, setOptions] = useState({
    profile: true,
    projects: true,
    skills: true,
    timeline: true,
    software: true,
  });

  useEffect(() => {
    if (isOpen) {
      loadSnapshot();
    }
  }, [isOpen]);

  const loadSnapshot = async () => {
    setLoading(true);
    try {
      const data = await fetchPortfolioSnapshot();
      setSnapshot(data);
    } catch (err) {
      console.error("Error loading portfolio snapshot:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImport = () => {
    if (!snapshot) return;

    const importedData = {};

    // 1. Profile Info
    if (options.profile && snapshot.profile) {
      const p = snapshot.profile;
      importedData.personalInfo = {
        fullName: p.fullName || "Kanhu Charan Sahoo",
        professionalTitle: p.professionalTitle || "Senior Frontend Developer",
        email: p.email || "kanhucharansahoo595@gmail.com",
        phone: p.phone || "+91 9090856788",
        location: p.location || "Bhubaneswar, Odisha",
        website: p.portfolioUrl || "https://kanhustudio.dev",
        linkedIn: p.linkedinUrl || "https://linkedin.com/in/kanhucharansahoo",
        github: p.githubUrl || "https://github.com/0908563188",
        photoUrl: p.avatar?.url || "",
      };
      if (p.aboutMe) {
        importedData.summary = p.aboutMe;
      }
    }

    // 2. Skills
    if (options.skills && snapshot.skills?.length > 0) {
      importedData.skills = snapshot.skills.map((s, idx) => ({
        id: "sk-imp-" + idx,
        name: s.title || s.name,
        category: s.category || "Frontend",
        level: s.proficiency ? `${s.proficiency}%` : "Proficient",
      }));
    }

    // 3. Projects
    if (options.projects && snapshot.projects?.length > 0) {
      importedData.projects = snapshot.projects.map((proj, idx) => ({
        id: "proj-imp-" + idx,
        title: proj.title,
        role: "Frontend Engineer",
        techStack: proj.technologies || proj.techStack || "React.js, Tailwind CSS",
        link: proj.projectUrl || proj.gitRepoLink || "",
        description: proj.description || "",
        highlights: [
          `Engineered modern responsive application interface with seamless user flow.`,
        ],
      }));
    }

    // 4. Timeline (Experience & Education)
    if (options.timeline && snapshot.timeline?.length > 0) {
      const expItems = [];
      const eduItems = [];

      snapshot.timeline.forEach((item, idx) => {
        const titleLower = (item.title || "").toLowerCase();
        const isEdu =
          titleLower.includes("bachelor") ||
          titleLower.includes("master") ||
          titleLower.includes("degree") ||
          titleLower.includes("university") ||
          titleLower.includes("college") ||
          titleLower.includes("school") ||
          titleLower.includes("education");

        const dateFrom = item.timeline?.from || item.from || "2022";
        const dateTo = item.timeline?.to || item.to || "Present";

        if (isEdu) {
          eduItems.push({
            id: "edu-imp-" + idx,
            degree: item.title,
            institution: item.subtitle || "University",
            startDate: dateFrom,
            endDate: dateTo,
            grade: "",
            highlights: [item.description].filter(Boolean),
          });
        } else {
          expItems.push({
            id: "exp-imp-" + idx,
            role: item.title,
            company: item.subtitle || "Tech Company",
            location: "Bhubaneswar / Remote",
            startDate: dateFrom,
            endDate: dateTo,
            isCurrent: String(dateTo).toLowerCase() === "present",
            highlights: [item.description].filter(Boolean),
          });
        }
      });

      if (expItems.length > 0) importedData.experience = expItems;
      if (eduItems.length > 0) importedData.education = eduItems;
    }

    // 5. Software Tools
    if (options.software && snapshot.software?.length > 0) {
      // Append software tools as skills or achievements
      const toolSkills = snapshot.software.map((sw, idx) => ({
        id: "tool-sk-" + idx,
        name: sw.name,
        category: "Tools & Environment",
        level: "Proficient",
      }));
      importedData.skills = [...(importedData.skills || []), ...toolSkills];
    }

    onResumeImported(importedData);
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
          maxWidth: 580,
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
              <DownloadCloud size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--admin-text-primary)", margin: 0 }}>
                Import From Portfolio
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)", margin: "2px 0 0" }}>
                Populate your resume seamlessly using your existing portfolio entries.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-neumorph" style={{ padding: 8 }}>
            <X size={18} />
          </button>
        </div>

        {/* Notice Badge */}
        <div
          className="neumorph-inset-sm"
          style={{
            margin: "18px 0",
            padding: "12px 14px",
            borderRadius: 12,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <AlertCircle size={18} color="var(--admin-accent)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: "0.78rem", color: "var(--admin-text-secondary)", margin: 0, lineHeight: 1.5 }}>
            <strong>Safe Snapshot:</strong> Data is cloned as an independent draft. Editing this resume will <strong>never modify</strong> your live portfolio data.
          </p>
        </div>

        {/* Checkbox Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <OptionCheckbox
            icon={User}
            title="Profile & Bio Details"
            desc="Name, Title, Email, Phone, Location, Social URLs, and About Me"
            count={snapshot?.profile ? "Ready" : "—"}
            checked={options.profile}
            onChange={() => toggleOption("profile")}
          />

          <OptionCheckbox
            icon={FolderGit2}
            title="Projects Collection"
            desc="Project names, tech stacks, links, and descriptions"
            count={snapshot?.projects ? `${snapshot.projects.length} projects` : "—"}
            checked={options.projects}
            onChange={() => toggleOption("projects")}
          />

          <OptionCheckbox
            icon={Cpu}
            title="Technical Skills"
            desc="Programming languages, frameworks, libraries, and proficiencies"
            count={snapshot?.skills ? `${snapshot.skills.length} skills` : "—"}
            checked={options.skills}
            onChange={() => toggleOption("skills")}
          />

          <OptionCheckbox
            icon={GraduationCap}
            title="Experience & Education Timeline"
            desc="Work history positions and educational degrees"
            count={snapshot?.timeline ? `${snapshot.timeline.length} timeline milestones` : "—"}
            checked={options.timeline}
            onChange={() => toggleOption("timeline")}
          />

          <OptionCheckbox
            icon={Layers}
            title="Software Tools & Technologies"
            desc="Developer tooling, IDEs, platforms, and utilities"
            count={snapshot?.software ? `${snapshot.software.length} tools` : "—"}
            checked={options.software}
            onChange={() => toggleOption("software")}
          />
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 18,
            borderTop: "var(--admin-border)",
            marginTop: 20,
          }}
        >
          <button onClick={onClose} className="btn-neumorph" style={{ padding: "8px 18px" }}>
            Cancel
          </button>

          <button
            onClick={handleImport}
            disabled={loading}
            className="btn-neumorph-primary"
            style={{ padding: "8px 22px", gap: 8 }}
          >
            <Check size={16} />
            <span>Import Data into Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionCheckbox({ icon: Icon, title, desc, count, checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className="neumorph-card-sm"
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        border: checked ? "1.5px solid var(--admin-accent)" : "var(--admin-border)",
        background: checked ? "var(--admin-inset-bg)" : "var(--admin-card-bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--admin-card-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--admin-accent)",
          }}
        >
          <Icon size={16} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
              {title}
            </span>
            <span style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)" }}>({count})</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--admin-text-secondary)", margin: 0 }}>
            {desc}
          </p>
        </div>
      </div>

      <div className={`neumorph-toggle ${checked ? "active" : ""}`}>
        <div className="neumorph-toggle-thumb" />
      </div>
    </div>
  );
}
