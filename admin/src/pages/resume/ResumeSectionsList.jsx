import React from "react";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  FolderGit2,
  Award,
  Trophy,
  Globe2,
  Heart,
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export const SECTION_METADATA = [
  { id: "personal", label: "Personal Information", icon: User, required: true },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "languages", label: "Languages", icon: Globe2 },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "custom", label: "Custom Section", icon: Sparkles },
];

export default function ResumeSectionsList({
  sectionsOrder = [],
  sectionsVisibility = {},
  activeSection = "personal",
  onSelectSection,
  onToggleSection,
  onReorderSection,
  onAddCustomSection,
}) {
  const moveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sectionsOrder.length) return;
    const newOrder = [...sectionsOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[newIndex];
    newOrder[newIndex] = temp;
    onReorderSection(newOrder);
  };

  // Combine standard sections in order + any extra sections
  const fullOrder = Array.from(
    new Set([...sectionsOrder, ...SECTION_METADATA.map((s) => s.id)])
  );

  return (
    <div
      className="neumorph-card"
      style={{
        padding: "20px 18px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--admin-text-primary)",
            marginBottom: 4,
          }}
        >
          Resume Sections
        </h3>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--admin-text-muted)",
          }}
        >
          Drag to reorder • Toggle to show/hide
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          paddingRight: 4,
          flex: 1,
        }}
      >
        {fullOrder.map((secId, idx) => {
          const meta = SECTION_METADATA.find((s) => s.id === secId) || {
            id: secId,
            label: secId.charAt(0).toUpperCase() + secId.slice(1),
            icon: Sparkles,
          };
          const Icon = meta.icon;
          const isVisible = sectionsVisibility[secId] !== false;
          const isActive = activeSection === secId;

          return (
            <div
              key={secId}
              onClick={() => onSelectSection(secId)}
              className={`section-nav-item ${isActive ? "active" : ""}`}
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {/* Left Grip + Icon + Label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    color: "var(--admin-text-muted)",
                    cursor: "grab",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => moveSection(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === 0 ? "transparent" : "var(--admin-text-muted)",
                      cursor: idx === 0 ? "default" : "pointer",
                      padding: 0,
                      display: "flex",
                      lineHeight: 1,
                    }}
                    title="Move section up"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    onClick={() => moveSection(idx, 1)}
                    disabled={idx === fullOrder.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      color: idx === fullOrder.length - 1 ? "transparent" : "var(--admin-text-muted)",
                      cursor: idx === fullOrder.length - 1 ? "default" : "pointer",
                      padding: 0,
                      display: "flex",
                      lineHeight: 1,
                    }}
                    title="Move section down"
                  >
                    <ChevronDown size={13} />
                  </button>
                </div>

                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive ? "var(--admin-accent-gradient)" : "var(--admin-inset-bg)",
                    color: isActive ? "#ffffff" : "var(--admin-accent)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} />
                </div>

                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? "var(--admin-accent)" : "var(--admin-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Toggle Switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSection(secId);
                }}
                className={`neumorph-toggle ${isVisible ? "active" : ""}`}
                title={isVisible ? "Visible on resume" : "Hidden from resume"}
              >
                <div className="neumorph-toggle-thumb" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Section Button */}
      <button
        onClick={onAddCustomSection}
        className="btn-neumorph"
        style={{
          width: "100%",
          justifyContent: "center",
          padding: "10px",
          gap: 6,
          fontSize: "0.84rem",
          fontWeight: 600,
          borderStyle: "dashed",
          marginTop: "auto",
        }}
      >
        <Plus size={16} color="var(--admin-accent)" />
        <span>Add Custom Section</span>
      </button>
    </div>
  );
}
