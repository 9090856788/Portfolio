import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Eye,
  Download,
  DownloadCloud,
  Layers,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  Check,
  Target,
  Palette,
  ShieldCheck,
  History,
  FileDown,
  Printer,
  ChevronRight,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { setToast } from "../../redux/store";
import {
  fetchResumes,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from "../../api/adminApi";
import ResumeSectionsList from "./ResumeSectionsList";
import ResumeFormEditor from "./ResumeFormEditor";
import ResumeLivePreview from "./ResumeLivePreview";
import { ResumeDocument } from "./ResumeTemplates";
import ResumeTemplatesModal from "./ResumeTemplatesModal";
import ImportPortfolioModal from "./ImportPortfolioModal";
import AtsQualityModal from "./AtsQualityModal";
import JobDescriptionModal from "./JobDescriptionModal";
import VersionHistoryModal from "./VersionHistoryModal";
import ResumeExportModal from "./ResumeExportModal";

export default function ResumeBuilderPage() {
  const dispatch = useDispatch();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeResume, setActiveResume] = useState(null); // null means dashboard view
  const [activeSection, setActiveSection] = useState("personal");

  // Modals state
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Autosave status
  const [saveStatus, setSaveStatus] = useState("Saved"); // "Saving...", "Saved", "Unsaved changes"
  const autosaveTimeoutRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes:", err);
      dispatch(setToast({ type: "error", message: "Failed to load resumes" }));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Dashboard Actions ----------------

  const handleCreateNew = async (customTitle = "") => {
    const defaultTemplate = {
      title: customTitle || "Frontend Developer Resume",
      status: "Draft",
      templateId: "modern-pro",
      customization: {
        accentColor: "#4f46e5",
        fontFamily: "Plus Jakarta Sans",
        fontSize: "10pt",
        lineSpacing: "1.45",
        marginSize: "16mm",
        showPhoto: true,
      },
      personalInfo: {
        fullName: "Kanhu Charan Sahoo",
        professionalTitle: "Senior Frontend Developer",
        email: "kanhucharansahoo595@gmail.com",
        phone: "+91 9090856788",
        location: "Bhubaneswar, Odisha",
        website: "https://kanhustudio.dev",
        linkedIn: "https://linkedin.com/in/kanhucharansahoo",
        github: "https://github.com/0908563188",
        photoUrl: "",
      },
      summary: "Accomplished Senior Frontend Developer with 4+ years of expertise architecting high-performance web applications using React.js, Redux, Next.js, and TypeScript. Proven track record of scaling responsive enterprise UIs, cutting bundle sizes by 35%, and driving seamless user journeys.",
      experience: [
        {
          id: "exp-1",
          role: "Senior Frontend Developer",
          company: "Enterprise Solutions",
          location: "Bhubaneswar, India",
          startDate: "May 2024",
          endDate: "Present",
          isCurrent: true,
          highlights: [
            "Architected modular micro-frontends serving 50,000+ daily active users using React and Vite.",
            "Decreased average bundle size by 35% and improved Lighthouse core web vitals score to 98.",
            "Mentored team of 4 junior developers in TypeScript best practices and state management.",
          ],
        },
      ],
      education: [
        {
          id: "edu-1",
          degree: "Master of Computer Applications (MCA)",
          institution: "Suresh Gyan Vihar University",
          location: "Jaipur, India",
          startDate: "2020",
          endDate: "2022",
          grade: "CGPA: 7.8",
          highlights: [],
        },
      ],
      skills: [
        { id: "sk-1", name: "React.js", category: "Frontend" },
        { id: "sk-2", name: "TypeScript", category: "Languages" },
        { id: "sk-3", name: "JavaScript (ES6+)", category: "Languages" },
        { id: "sk-4", name: "Redux Toolkit", category: "State Management" },
        { id: "sk-5", name: "Tailwind CSS", category: "Frontend" },
        { id: "sk-6", name: "Node.js", category: "Backend" },
        { id: "sk-7", name: "RESTful APIs", category: "API & Network" },
        { id: "sk-8", name: "Git & GitHub", category: "Tools" },
      ],
      projects: [
        {
          id: "proj-1",
          title: "Full-Stack Portfolio Workspace",
          role: "Lead Architect",
          techStack: "React, Node.js, Express, Tailwind CSS",
          link: "https://kanhustudio.dev",
          description: "Full-stack portfolio with interactive neumorphic admin workspace and real-time CMS.",
          highlights: ["Engineered responsive dashboards with modular architecture and zero layout shifts."],
        },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "Meta Certified Frontend Developer",
          issuer: "Meta / Coursera",
          issueDate: "2023",
        },
      ],
      achievements: [
        {
          id: "ach-1",
          title: "Top Performer 2024",
          description: "Awarded for exceptional delivery of mission-critical customer portal on time.",
        },
      ],
      languages: [
        { id: "lang-1", name: "English", proficiency: "Professional Working" },
        { id: "lang-2", name: "Odia", proficiency: "Native" },
        { id: "lang-3", name: "Hindi", proficiency: "Fluent" },
      ],
      interests: ["Open Source Development", "UI/UX Engineering", "System Performance"],
      sectionsOrder: [
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
      sectionsVisibility: {},
    };

    try {
      const created = await createResume(defaultTemplate);
      setResumes((prev) => [created, ...prev]);
      setActiveResume(created);
      dispatch(setToast({ type: "success", message: "Created new resume version" }));
    } catch (err) {
      dispatch(setToast({ type: "error", message: err.message }));
    }
  };

  const handleDuplicate = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const dup = await duplicateResume(id);
      setResumes((prev) => [dup, ...prev]);
      dispatch(setToast({ type: "success", message: "Resume duplicated successfully" }));
    } catch (err) {
      dispatch(setToast({ type: "error", message: err.message }));
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume version?")) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      if (activeResume?._id === id) setActiveResume(null);
      dispatch(setToast({ type: "info", message: "Resume deleted" }));
    } catch (err) {
      dispatch(setToast({ type: "error", message: err.message }));
    }
  };

  // ---------------- Builder Live Editing & Autosave ----------------

  const handleResumeChange = (updated) => {
    setActiveResume(updated);
    setSaveStatus("Saving...");

    // Debounced autosave to server/storage
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateResume(updated._id, updated);
        setSaveStatus("Saved");
        // Update item in local list
        setResumes((prev) =>
          prev.map((r) => (r._id === updated._id ? { ...updated, updatedAt: new Date() } : r))
        );
      } catch (err) {
        setSaveStatus("Unsaved changes");
      }
    }, 1200);
  };

  const handleManualSave = async () => {
    if (!activeResume) return;
    setSaveStatus("Saving...");
    try {
      const saved = await updateResume(activeResume._id, {
        ...activeResume,
        status: "Saved",
      });
      setActiveResume(saved);
      setSaveStatus("Saved");
      dispatch(setToast({ type: "success", message: "Resume saved successfully" }));
      setResumes((prev) =>
        prev.map((r) => (r._id === saved._id ? saved : r))
      );
    } catch (err) {
      dispatch(setToast({ type: "error", message: err.message }));
    }
  };

  // Section visibility and reordering
  const handleToggleSection = (secId) => {
    if (!activeResume) return;
    const currentVis = activeResume.sectionsVisibility || {};
    const nextVis = {
      ...currentVis,
      [secId]: currentVis[secId] === false ? true : false,
    };
    handleResumeChange({
      ...activeResume,
      sectionsVisibility: nextVis,
    });
  };

  const handleReorderSection = (newOrder) => {
    if (!activeResume) return;
    handleResumeChange({
      ...activeResume,
      sectionsOrder: newOrder,
    });
  };

  const handleAddCustomSection = () => {
    const title = window.prompt("Enter Custom Section Title:", "Key Accomplishments");
    if (!title) return;
    const currentCustom = activeResume.customSections || [];
    const newSec = {
      id: "cust-" + Date.now(),
      title,
      description: "Custom details, portfolio links, patents, or publications.",
    };
    handleResumeChange({
      ...activeResume,
      customSections: [...currentCustom, newSec],
      sectionsOrder: [...(activeResume.sectionsOrder || []), "custom"],
    });
    setActiveSection("custom");
  };

  // Trigger Native Clean A4 Print
  const handleTriggerPrint = () => {
    if (!activeResume) return;
    const originalTitle = document.title;
    const candidateName = (activeResume.personalInfo?.fullName || "Kanhu_Charan_Sahoo").replace(/\s+/g, "_");
    const versionTitle = (activeResume.title || "Resume").replace(/\s+/g, "_");
    document.title = `${candidateName}_${versionTitle}`;

    window.print();

    // Restore title
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  // Snapshot / Version History
  const handleSaveSnapshot = async (note) => {
    if (!activeResume) return;
    const currentVersions = activeResume.versions || [];
    const newVersion = {
      version: currentVersions.length + 1,
      timestamp: new Date().toISOString(),
      note,
      snapshot: { ...activeResume },
    };
    const updated = {
      ...activeResume,
      versions: [newVersion, ...currentVersions],
    };
    handleResumeChange(updated);
    dispatch(setToast({ type: "success", message: `Saved milestone checkpoint: ${note}` }));
  };

  const handleRestoreVersion = (ver) => {
    if (!ver || !ver.snapshot) return;
    handleResumeChange({
      ...ver.snapshot,
      _id: activeResume._id,
    });
    dispatch(setToast({ type: "info", message: `Restored version checkpoint: ${ver.note}` }));
  };

  // ---------------- Render Views ----------------

  return (
    <div style={{ padding: "0 0 30px" }}>
      {/* Hidden container dedicated to clean vector printing */}
      {activeResume && (
        <div id="printable-resume-container" className="print-only-container">
          <ResumeDocument resume={activeResume} isPrint={true} />
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {!activeResume && (
        <div>
          {/* Top Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  color: "var(--admin-text-primary)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Custom Resume Builder
              </h1>
              <p style={{ fontSize: "0.84rem", color: "var(--admin-text-muted)", margin: "4px 0 0" }}>
                Craft multiple ATS-optimized resume variants, import portfolio assets, and export vector A4 PDFs.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-neumorph"
                style={{ padding: "10px 18px", gap: 8 }}
              >
                <DownloadCloud size={16} color="var(--admin-accent)" />
                <span>Import from Portfolio</span>
              </button>

              <button
                onClick={() => handleCreateNew()}
                className="btn-neumorph-primary"
                style={{ padding: "10px 22px", gap: 8 }}
              >
                <Plus size={18} />
                <span>Create New Resume</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <MetricCard
              icon={FileText}
              label="Saved Versions"
              value={resumes.length}
              subtext="Multiple target profiles"
            />
            <MetricCard
              icon={ShieldCheck}
              label="ATS Compatibility"
              value="94%"
              subtext="Engineered for parsers"
              accent="#10b981"
            />
            <MetricCard
              icon={Palette}
              label="Ready Templates"
              value="6 Layouts"
              subtext="Modern, Minimal, Tech"
              accent="#6366f1"
            />
            <MetricCard
              icon={Clock}
              label="Autosave Active"
              value="Real-Time"
              subtext="Continuous state persistence"
              accent="#f59e0b"
            />
          </div>

          {/* Resumes Grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
                Your Resume Profiles ({resumes.length})
              </h2>
            </div>

            {loading ? (
              <div style={{ padding: "60px 0", textAlign: "center", color: "var(--admin-text-muted)" }}>
                Loading resume collections...
              </div>
            ) : resumes.length === 0 ? (
              <div
                className="neumorph-card"
                style={{ padding: "50px 20px", textAlign: "center", borderRadius: 20 }}
              >
                <FileText size={44} color="var(--admin-accent)" style={{ margin: "0 auto 12px", opacity: 0.8 }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
                  No Resumes Created Yet
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--admin-text-muted)", maxWidth: 440, margin: "6px auto 20px" }}>
                  Get started by creating your first resume or importing data directly from your portfolio.
                </p>
                <button
                  onClick={() => handleCreateNew("Frontend Developer Resume")}
                  className="btn-neumorph-primary"
                  style={{ padding: "10px 24px" }}
                >
                  Create Frontend Resume
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {resumes.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setActiveResume(item)}
                    className="neumorph-card"
                    style={{
                      padding: "20px 22px",
                      borderRadius: 18,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 220,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div>
                      {/* Card Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                            background: item.status === "Saved" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                            color: item.status === "Saved" ? "#10b981" : "#f59e0b",
                            border: `1px solid ${item.status === "Saved" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                          }}
                        >
                          {item.status || "Draft"}
                        </span>

                        <span className="ats-badge">ATS-Ready</span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3
                        style={{
                          fontSize: "1.08rem",
                          fontWeight: 800,
                          color: "var(--admin-text-primary)",
                          margin: "4px 0 6px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--admin-text-secondary)",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.summary || item.personalInfo?.professionalTitle || "Custom candidate profile"}
                      </p>
                    </div>

                    {/* Footer Info & Actions */}
                    <div style={{ paddingTop: 16, borderTop: "var(--admin-border)", marginTop: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                          fontSize: "0.74rem",
                          color: "var(--admin-text-muted)",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Calendar size={12} />
                          <span>
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "Just now"}
                          </span>
                        </span>
                        <span>Template: {item.templateId || "Modern Pro"}</span>
                      </div>

                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={(e) => handleDuplicate(item._id, e)}
                          className="btn-neumorph"
                          style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                          title="Duplicate Resume"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item._id, e)}
                          className="btn-neumorph-danger"
                          style={{ padding: "6px 10px", fontSize: "0.78rem" }}
                          title="Delete Resume"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveResume(item);
                          }}
                          className="btn-neumorph-primary"
                          style={{ padding: "6px 14px", fontSize: "0.78rem", gap: 4 }}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-COLUMN BUILDER VIEW */}
      {activeResume && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          {/* Top Header Bar with Resume Controls */}
          <div
            className="neumorph-card"
            style={{
              padding: "12px 20px",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              borderRadius: 16,
            }}
          >
            {/* Left: Back button, Title input, and Autosave status */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => setActiveResume(null)}
                className="btn-neumorph"
                style={{ padding: "8px 12px", gap: 6, fontSize: "0.82rem" }}
              >
                <ArrowLeft size={16} />
                <span>Dashboard</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="text"
                  value={activeResume.title}
                  onChange={(e) => handleResumeChange({ ...activeResume, title: e.target.value })}
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--admin-text-primary)",
                    borderBottom: "1px dashed rgba(148, 163, 184, 0.4)",
                    padding: "2px 4px",
                    width: 260,
                  }}
                  title="Click to rename resume version"
                />

                <span
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    color: saveStatus === "Saved" ? "#10b981" : "var(--admin-text-muted)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {saveStatus === "Saved" && <Check size={12} color="#10b981" />}
                  <span>{saveStatus}</span>
                </span>
              </div>
            </div>

            {/* Right: Feature Tool Modals & Export */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-neumorph"
                style={{ padding: "7px 12px", fontSize: "0.8rem", gap: 5 }}
                title="Import From Portfolio"
              >
                <DownloadCloud size={14} color="var(--admin-accent)" />
                <span>Import</span>
              </button>

              <button
                onClick={() => setShowJobModal(true)}
                className="btn-neumorph"
                style={{ padding: "7px 12px", fontSize: "0.8rem", gap: 5 }}
                title="Match with Job Description"
              >
                <Target size={14} color="var(--admin-accent)" />
                <span>Match Job</span>
              </button>

              <button
                onClick={() => setShowTemplatesModal(true)}
                className="btn-neumorph"
                style={{ padding: "7px 12px", fontSize: "0.8rem", gap: 5 }}
                title="Templates & Styling"
              >
                <Palette size={14} color="var(--admin-accent)" />
                <span>Templates</span>
              </button>

              <button
                onClick={() => setShowAtsModal(true)}
                className="btn-neumorph"
                style={{ padding: "7px 12px", fontSize: "0.8rem", gap: 5 }}
                title="ATS & Quality Score"
              >
                <ShieldCheck size={14} color="#10b981" />
                <span>ATS Score</span>
              </button>

              <button
                onClick={() => setShowHistoryModal(true)}
                className="btn-neumorph"
                style={{ padding: "7px 12px", fontSize: "0.8rem", gap: 5 }}
                title="Version History"
              >
                <History size={14} color="var(--admin-text-muted)" />
                <span>Versions</span>
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="btn-neumorph-primary"
                style={{ padding: "7px 16px", fontSize: "0.82rem", gap: 6 }}
                title="Export & PDF"
              >
                <Printer size={15} />
                <span>Export / PDF</span>
              </button>
            </div>
          </div>

          {/* 3-COLUMN DESKTOP LAYOUT */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "260px 1fr 1.15fr",
              gap: 16,
              overflow: "hidden",
            }}
          >
            {/* COLUMN 1: Section Navigation */}
            <div style={{ height: "100%", overflow: "hidden" }}>
              <ResumeSectionsList
                sectionsOrder={activeResume.sectionsOrder || []}
                sectionsVisibility={activeResume.sectionsVisibility || {}}
                activeSection={activeSection}
                onSelectSection={(id) => setActiveSection(id)}
                onToggleSection={handleToggleSection}
                onReorderSection={handleReorderSection}
                onAddCustomSection={handleAddCustomSection}
              />
            </div>

            {/* COLUMN 2: Center Section Form Editor */}
            <div style={{ height: "100%", overflowY: "auto" }}>
              <ResumeFormEditor
                resume={activeResume}
                activeSection={activeSection}
                onChange={handleResumeChange}
                onSaveDraft={() => {
                  handleResumeChange({ ...activeResume, status: "Draft" });
                  dispatch(setToast({ type: "info", message: "Draft saved" }));
                }}
                onSaveResume={handleManualSave}
              />
            </div>

            {/* COLUMN 3: Right Live Real-Time A4 Preview */}
            <div style={{ height: "100%", overflow: "hidden" }}>
              <ResumeLivePreview
                resume={activeResume}
                onDownloadPdf={() => setShowExportModal(true)}
                onOpenTemplates={() => setShowTemplatesModal(true)}
                onOpenAtsCheck={() => setShowAtsModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <ResumeTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        resume={activeResume}
        onApplyCustomization={({ templateId, customization }) => {
          handleResumeChange({
            ...activeResume,
            templateId,
            customization: { ...activeResume.customization, ...customization },
          });
          dispatch(setToast({ type: "success", message: "Template and styling applied" }));
        }}
        onDownloadPdf={handleTriggerPrint}
      />

      <ImportPortfolioModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onResumeImported={(importedData) => {
          if (activeResume) {
            handleResumeChange({
              ...activeResume,
              ...importedData,
            });
          } else {
            handleCreateNew("Portfolio Imported Resume");
          }
          dispatch(setToast({ type: "success", message: "Portfolio data successfully cloned into resume!" }));
        }}
      />

      <AtsQualityModal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        resume={activeResume}
      />

      <JobDescriptionModal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        resume={activeResume}
        onIncorporateKeywords={(kw) => {
          const currentSkills = activeResume?.skills || [];
          if (!currentSkills.some((s) => s.name.toLowerCase() === kw.toLowerCase())) {
            handleResumeChange({
              ...activeResume,
              skills: [
                ...currentSkills,
                { id: "sk-" + Date.now(), name: kw, category: "Core Technologies" },
              ],
            });
            dispatch(setToast({ type: "success", message: `Added "${kw}" to resume skills` }));
          }
        }}
      />

      <VersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        resume={activeResume}
        onSaveSnapshot={handleSaveSnapshot}
        onRestoreVersion={handleRestoreVersion}
      />

      <ResumeExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resume={activeResume}
        onTriggerPrint={handleTriggerPrint}
        onImportJson={(jsonData) => {
          handleResumeChange(jsonData);
          dispatch(setToast({ type: "success", message: "Imported resume from JSON" }));
        }}
      />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext, accent = "var(--admin-accent)" }) {
  return (
    <div
      className="neumorph-card"
      style={{
        padding: "16px 18px",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: "var(--admin-inset-bg)",
          boxShadow: "var(--admin-inset-shadow-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          flexShrink: 0,
        }}
      >
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: "0.76rem", color: "var(--admin-text-muted)", fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--admin-text-primary)", lineHeight: 1.2 }}>
          {value}
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--admin-text-secondary)" }}>
          {subtext}
        </div>
      </div>
    </div>
  );
}
