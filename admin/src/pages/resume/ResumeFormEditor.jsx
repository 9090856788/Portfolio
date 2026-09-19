import React, { useState } from "react";
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
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp,
  Link,
  Wand2,
  ExternalLink,
} from "lucide-react";

export default function ResumeFormEditor({
  resume,
  activeSection = "personal",
  onChange,
  onSaveDraft,
  onSaveResume,
}) {
  const personalInfo = resume.personalInfo || {};
  const summary = resume.summary || "";
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const achievements = resume.achievements || [];
  const languages = resume.languages || [];
  const interests = resume.interests || [];
  const customSections = resume.customSections || [];

  // Local helper to update personal info
  const handlePersonalChange = (field, value) => {
    onChange({
      ...resume,
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  // Helper to update summary
  const handleSummaryChange = (val) => {
    onChange({
      ...resume,
      summary: val,
    });
  };

  // ---------------- Work Experience Helpers ----------------
  const handleAddExperience = () => {
    const newExp = {
      id: "exp-" + Date.now(),
      role: "Frontend Developer",
      company: "Company Name",
      location: "City, Country",
      startDate: "2024",
      endDate: "Present",
      isCurrent: true,
      highlights: ["Developed responsive web applications with modern frontend frameworks."],
    };
    onChange({
      ...resume,
      experience: [newExp, ...experience],
    });
  };

  const handleUpdateExperience = (id, field, value) => {
    const updated = experience.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...resume, experience: updated });
  };

  const handleDeleteExperience = (id) => {
    onChange({
      ...resume,
      experience: experience.filter((item) => item.id !== id),
    });
  };

  const handleAddExpBullet = (expId) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        return {
          ...item,
          highlights: [...(item.highlights || []), "Collaborated with team to deliver high-quality features."],
        };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  const handleUpdateExpBullet = (expId, bIndex, value) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        const h = [...(item.highlights || [])];
        h[bIndex] = value;
        return { ...item, highlights: h };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  const handleDeleteExpBullet = (expId, bIndex) => {
    const updated = experience.map((item) => {
      if (item.id === expId) {
        const h = item.highlights.filter((_, i) => i !== bIndex);
        return { ...item, highlights: h };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  // ---------------- Education Helpers ----------------
  const handleAddEducation = () => {
    const newEdu = {
      id: "edu-" + Date.now(),
      degree: "Bachelor of Technology in Computer Science",
      institution: "University Name",
      location: "City",
      startDate: "2018",
      endDate: "2022",
      grade: "Final CGPA: 8.0",
      highlights: [],
    };
    onChange({ ...resume, education: [newEdu, ...education] });
  };

  const handleUpdateEducation = (id, field, value) => {
    const updated = education.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...resume, education: updated });
  };

  const handleDeleteEducation = (id) => {
    onChange({ ...resume, education: education.filter((item) => item.id !== id) });
  };

  // ---------------- Skills Helpers ----------------
  const [newSkillText, setNewSkillText] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    if (!newSkillText.trim()) return;
    const newSk = {
      id: "sk-" + Date.now(),
      name: newSkillText.trim(),
      category: newSkillCategory,
      level: "Proficient",
    };
    onChange({ ...resume, skills: [...skills, newSk] });
    setNewSkillText("");
  };

  const handleDeleteSkill = (id) => {
    onChange({ ...resume, skills: skills.filter((s) => s.id !== id) });
  };

  // ---------------- Projects Helpers ----------------
  const handleAddProject = () => {
    const newP = {
      id: "proj-" + Date.now(),
      title: "New Project",
      role: "Lead Developer",
      techStack: "React, Node.js, Tailwind CSS",
      link: "https://github.com",
      description: "Brief summary of architecture, objectives, and impact.",
      highlights: ["Implemented performant client UI and integrated RESTful endpoints."],
    };
    onChange({ ...resume, projects: [newP, ...projects] });
  };

  const handleUpdateProject = (id, field, value) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    onChange({ ...resume, projects: updated });
  };

  const handleDeleteProject = (id) => {
    onChange({ ...resume, projects: projects.filter((p) => p.id !== id) });
  };

  // ---------------- Certifications Helpers ----------------
  const handleAddCert = () => {
    const newC = {
      id: "cert-" + Date.now(),
      name: "New Certification",
      issuer: "Credential Authority",
      issueDate: "2024",
      link: "",
    };
    onChange({ ...resume, certifications: [...certifications, newC] });
  };

  const handleUpdateCert = (id, field, value) => {
    const updated = certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    onChange({ ...resume, certifications: updated });
  };

  const handleDeleteCert = (id) => {
    onChange({ ...resume, certifications: certifications.filter((c) => c.id !== id) });
  };

  // ---------------- Achievements Helpers ----------------
  const handleAddAchievement = () => {
    const newA = {
      id: "ach-" + Date.now(),
      title: "Key Milestone",
      description: "Achieved measurable metric or delivered enterprise impact.",
    };
    onChange({ ...resume, achievements: [...achievements, newA] });
  };

  const handleUpdateAchievement = (id, field, value) => {
    const updated = achievements.map((a) => (a.id === id ? { ...a, [field]: value } : a));
    onChange({ ...resume, achievements: updated });
  };

  const handleDeleteAchievement = (id) => {
    onChange({ ...resume, achievements: achievements.filter((a) => a.id !== id) });
  };

  // ---------------- Languages Helpers ----------------
  const handleAddLanguage = () => {
    const newL = {
      id: "lang-" + Date.now(),
      name: "English",
      proficiency: "Professional Working Proficiency",
    };
    onChange({ ...resume, languages: [...languages, newL] });
  };

  const handleUpdateLanguage = (id, field, value) => {
    const updated = languages.map((l) => (l.id === id ? { ...l, [field]: value } : l));
    onChange({ ...resume, languages: updated });
  };

  const handleDeleteLanguage = (id) => {
    onChange({ ...resume, languages: languages.filter((l) => l.id !== id) });
  };

  // Render Editor by Active Section
  const renderEditorContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <div>
            {/* Top Profile Photo Section */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "2px solid var(--admin-border-accent)",
                  background: "var(--admin-inset-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "var(--admin-card-shadow-sm)",
                }}
              >
                {personalInfo.photoUrl ? (
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.fullName || "Profile"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={36} color="var(--admin-text-muted)" />
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <label
                    className="btn-neumorph"
                    style={{ fontSize: "0.82rem", padding: "8px 14px", cursor: "pointer" }}
                  >
                    <ImageIcon size={15} color="var(--admin-accent)" />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            handlePersonalChange("photoUrl", ev.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {personalInfo.photoUrl && (
                    <button
                      onClick={() => handlePersonalChange("photoUrl", "")}
                      className="btn-neumorph-danger"
                      style={{ padding: "8px 14px" }}
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                  Recommended: Square JPG or PNG, min 400x400px.
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px 20px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="neumorph-input"
                  value={personalInfo.fullName || ""}
                  onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                  placeholder="e.g. Kanhu Charan Sahoo"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Professional Title *</label>
                <input
                  type="text"
                  className="neumorph-input"
                  value={personalInfo.professionalTitle || ""}
                  onChange={(e) => handlePersonalChange("professionalTitle", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="neumorph-input"
                  value={personalInfo.email || ""}
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                  placeholder="e.g. kanhucharansahoo595@gmail.com"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="neumorph-input"
                  value={personalInfo.phone || ""}
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  placeholder="e.g. +91 9090856788"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="neumorph-input"
                  value={personalInfo.location || ""}
                  onChange={(e) => handlePersonalChange("location", e.target.value)}
                  placeholder="e.g. Bhubaneswar, Odisha"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Website / Portfolio</label>
                <input
                  type="url"
                  className="neumorph-input"
                  value={personalInfo.website || ""}
                  onChange={(e) => handlePersonalChange("website", e.target.value)}
                  placeholder="e.g. https://kanhustudio.dev"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">LinkedIn Profile</label>
                <input
                  type="url"
                  className="neumorph-input"
                  value={personalInfo.linkedIn || ""}
                  onChange={(e) => handlePersonalChange("linkedIn", e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/kanhucharansahoo"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">GitHub Profile</label>
                <input
                  type="url"
                  className="neumorph-input"
                  value={personalInfo.github || ""}
                  onChange={(e) => handlePersonalChange("github", e.target.value)}
                  placeholder="e.g. https://github.com/0908563188"
                />
              </div>
            </div>
          </div>
        );

      case "summary":
        return (
          <div>
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>Professional Summary Statement</label>
                <span style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                  {summary.length} characters • {summary.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                className="neumorph-input"
                rows={7}
                value={summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                placeholder="Brief, high-impact summary highlighting your experience, core stack, architectural expertise, and engineering accomplishments..."
                style={{ resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* AI / ATS Writing suggestions */}
            <div
              className="neumorph-inset-sm"
              style={{ padding: "14px 16px", borderRadius: 12 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: "0.82rem", fontWeight: 700, color: "var(--admin-accent)" }}>
                <Wand2 size={15} />
                <span>ATS Optimization Tip</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--admin-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Lead with your exact professional title (e.g., <strong>Senior Frontend Developer</strong>), specify exact years of experience, core frameworks (<strong>React.js, Redux, TypeScript</strong>), and emphasize business impact.
              </p>
            </div>
          </div>
        );

      case "experience":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {experience.length} work positions listed
              </span>
              <button
                onClick={handleAddExperience}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Position</span>
              </button>
            </div>

            {experience.map((exp, idx) => (
              <div
                key={exp.id}
                className="neumorph-card-sm"
                style={{
                  padding: "18px 20px",
                  borderRadius: 16,
                  border: "var(--admin-border)",
                  position: "relative",
                }}
              >
                {/* Header with Title and Delete */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        background: "var(--admin-accent-gradient)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--admin-text-primary)" }}>
                      {exp.role || "Job Role"} {exp.company ? `at ${exp.company}` : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="btn-neumorph-danger"
                    title="Delete position"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 16px", marginBottom: 14 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Role / Title *</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={exp.role || ""}
                      onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Company Name *</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={exp.company || ""}
                      onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Location</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={exp.location || ""}
                      onChange={(e) => handleUpdateExperience(exp.id, "location", e.target.value)}
                      placeholder="e.g. Bhubaneswar, India / Hybrid"
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: "0.8rem" }}>Start Date</label>
                      <input
                        type="text"
                        className="neumorph-input"
                        value={exp.startDate || ""}
                        onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                        placeholder="e.g. May 2025"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: "0.8rem" }}>End Date</label>
                      <input
                        type="text"
                        className="neumorph-input"
                        value={exp.endDate || ""}
                        onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                        placeholder="e.g. Present"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlights / Responsibilities */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", margin: 0 }}>
                      Responsibilities & Highlights ({exp.highlights?.length || 0})
                    </label>
                    <button
                      onClick={() => handleAddExpBullet(exp.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--admin-accent)",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Plus size={14} /> Add Bullet
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(exp.highlights || []).map((bullet, bIdx) => (
                      <div key={bIdx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)" }}>•</span>
                        <input
                          type="text"
                          className="neumorph-input"
                          style={{ padding: "8px 12px", fontSize: "0.86rem" }}
                          value={bullet}
                          onChange={(e) => handleUpdateExpBullet(exp.id, bIdx, e.target.value)}
                        />
                        <button
                          onClick={() => handleDeleteExpBullet(exp.id, bIdx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--admin-text-muted)",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          title="Remove bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {education.length} educational degrees
              </span>
              <button
                onClick={handleAddEducation}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Education</span>
              </button>
            </div>

            {education.map((edu, idx) => (
              <div
                key={edu.id}
                className="neumorph-card-sm"
                style={{ padding: "18px 20px", borderRadius: 16 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {edu.degree || "Degree"}
                  </span>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="btn-neumorph-danger"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 16px" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Degree / Program *</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={edu.degree || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                      placeholder="e.g. Master in Computer Application"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Institution / University *</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={edu.institution || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                      placeholder="e.g. Suresh Gyan Vihar University"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Dates</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        className="neumorph-input"
                        value={edu.startDate || ""}
                        onChange={(e) => handleUpdateEducation(edu.id, "startDate", e.target.value)}
                        placeholder="Start (e.g. June 2020)"
                      />
                      <input
                        type="text"
                        className="neumorph-input"
                        value={edu.endDate || ""}
                        onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                        placeholder="End (e.g. August 2022)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Grade / CGPA</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={edu.grade || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, "grade", e.target.value)}
                      placeholder="e.g. Final CGPA: 7.2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div>
            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                type="text"
                className="neumorph-input"
                placeholder="Add skill (e.g. React.js, TypeScript, Micro Frontend)..."
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                style={{ flex: 2 }}
              />
              <select
                className="neumorph-input"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="Frontend">Frontend</option>
                <option value="Mobile">Mobile</option>
                <option value="Languages">Languages</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="State Management">State Management</option>
                <option value="API">API & Network</option>
                <option value="Cloud">Cloud & DevOps</option>
                <option value="Tools">Tools & Testing</option>
              </select>
              <button type="submit" className="btn-neumorph-primary" style={{ padding: "0 18px" }}>
                <Plus size={16} />
                <span>Add</span>
              </button>
            </form>

            {/* Current Skills Cloud */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.map((sk) => (
                <div
                  key={sk.id || sk.name}
                  className="neumorph-card-sm"
                  style={{
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--admin-text-primary)" }}>
                    {sk.name}
                  </span>
                  {sk.category && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 6px",
                        borderRadius: 6,
                        background: "rgba(99, 102, 241, 0.15)",
                        color: "var(--admin-accent)",
                        fontWeight: 600,
                      }}
                    >
                      {sk.category}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--admin-text-muted)",
                      cursor: "pointer",
                      padding: 2,
                    }}
                    title="Remove skill"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {projects.length} featured projects
              </span>
              <button
                onClick={handleAddProject}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.map((proj) => (
              <div
                key={proj.id}
                className="neumorph-card-sm"
                style={{ padding: "18px 20px", borderRadius: 16 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {proj.title || "Project Title"}
                  </span>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="btn-neumorph-danger"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 16px", marginBottom: 12 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Project Title *</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={proj.title || ""}
                      onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Your Role / Contribution</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={proj.role || ""}
                      onChange={(e) => handleUpdateProject(proj.id, "role", e.target.value)}
                      placeholder="e.g. Lead Frontend Engineer"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Technology Stack</label>
                    <input
                      type="text"
                      className="neumorph-input"
                      value={proj.techStack || ""}
                      onChange={(e) => handleUpdateProject(proj.id, "techStack", e.target.value)}
                      placeholder="e.g. React.js, Redux, Node.js, MUI"
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "0.8rem" }}>Project / GitHub Link</label>
                    <input
                      type="url"
                      className="neumorph-input"
                      value={proj.link || ""}
                      onChange={(e) => handleUpdateProject(proj.id, "link", e.target.value)}
                      placeholder="https://kanhustudio.dev"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "0.8rem" }}>Description</label>
                  <textarea
                    className="neumorph-input"
                    rows={2}
                    value={proj.description || ""}
                    onChange={(e) => handleUpdateProject(proj.id, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "certifications":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {certifications.length} certifications
              </span>
              <button
                onClick={handleAddCert}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Certification</span>
              </button>
            </div>

            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="neumorph-card-sm"
                style={{ padding: "14px 16px", borderRadius: 14 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr auto", gap: 10, alignItems: "center" }}>
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Certificate Name"
                    value={cert.name || ""}
                    onChange={(e) => handleUpdateCert(cert.id, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Issuing Authority"
                    value={cert.issuer || ""}
                    onChange={(e) => handleUpdateCert(cert.id, "issuer", e.target.value)}
                  />
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Year"
                    value={cert.issueDate || ""}
                    onChange={(e) => handleUpdateCert(cert.id, "issueDate", e.target.value)}
                  />
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="btn-neumorph-danger"
                    style={{ padding: 8 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "achievements":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {achievements.length} key achievements
              </span>
              <button
                onClick={handleAddAchievement}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Achievement</span>
              </button>
            </div>

            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="neumorph-card-sm"
                style={{ padding: "14px 16px", borderRadius: 14 }}
              >
                <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Achievement Title (e.g. Bundle Optimization)"
                    value={ach.title || ""}
                    onChange={(e) => handleUpdateAchievement(ach.id, "title", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="btn-neumorph-danger"
                    style={{ padding: 8 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <textarea
                  className="neumorph-input"
                  rows={2}
                  placeholder="Detailed description of the result or award..."
                  value={ach.description || ""}
                  onChange={(e) => handleUpdateAchievement(ach.id, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        );

      case "languages":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--admin-text-secondary)", fontWeight: 600 }}>
                {languages.length} languages
              </span>
              <button
                onClick={handleAddLanguage}
                className="btn-neumorph"
                style={{ fontSize: "0.82rem", padding: "7px 14px", gap: 6 }}
              >
                <Plus size={15} color="var(--admin-accent)" />
                <span>Add Language</span>
              </button>
            </div>

            {languages.map((l) => (
              <div
                key={l.id}
                className="neumorph-card-sm"
                style={{ padding: "12px 14px", borderRadius: 12 }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "center" }}>
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Language (e.g. English)"
                    value={l.name || ""}
                    onChange={(e) => handleUpdateLanguage(l.id, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    className="neumorph-input"
                    placeholder="Proficiency (e.g. Professional Working)"
                    value={l.proficiency || ""}
                    onChange={(e) => handleUpdateLanguage(l.id, "proficiency", e.target.value)}
                  />
                  <button
                    onClick={() => handleDeleteLanguage(l.id)}
                    className="btn-neumorph-danger"
                    style={{ padding: 8 }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div>Select a section from the left sidebar to edit its details.</div>;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "personal":
        return {
          title: "Personal Information",
          desc: "Basic details that appear at the top of your resume.",
          icon: User,
        };
      case "summary":
        return {
          title: "Professional Summary",
          desc: "Executive elevator pitch outlining your engineering impact.",
          icon: FileText,
        };
      case "experience":
        return {
          title: "Work Experience",
          desc: "Chronological employment history, positions, and bullet points.",
          icon: Briefcase,
        };
      case "education":
        return {
          title: "Education",
          desc: "Academic degrees, universities, graduation dates, and honors.",
          icon: GraduationCap,
        };
      case "skills":
        return {
          title: "Skills & Technical Stack",
          desc: "Core languages, frameworks, state libraries, and developer tools.",
          icon: Cpu,
        };
      case "projects":
        return {
          title: "Key Projects",
          desc: "Featured applications, architecture roles, and live repository links.",
          icon: FolderGit2,
        };
      case "certifications":
        return {
          title: "Certifications",
          desc: "Verified industry credentials and cloud certifications.",
          icon: Award,
        };
      case "achievements":
        return {
          title: "Achievements & Awards",
          desc: "Recognitions, performance benchmarks, and notable deliverables.",
          icon: Trophy,
        };
      case "languages":
        return {
          title: "Languages",
          desc: "Spoken languages and professional communication proficiencies.",
          icon: Globe2,
        };
      default:
        return {
          title: "Section Editor",
          desc: "Customize section information.",
          icon: Sparkles,
        };
    }
  };

  const currentMeta = getSectionTitle();
  const Icon = currentMeta.icon;

  return (
    <div
      className="neumorph-card"
      style={{
        padding: "24px 28px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Top Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingBottom: 16,
          borderBottom: "var(--admin-border)",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "var(--admin-accent-gradient)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "var(--admin-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {currentMeta.title}
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--admin-text-muted)",
              marginTop: 2,
            }}
          >
            {currentMeta.desc}
          </p>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {renderEditorContent()}
      </div>

      {/* Bottom Save Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 16,
          borderTop: "var(--admin-border)",
          marginTop: "auto",
        }}
      >
        <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
          Changes are continuously autosaved to this resume draft.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onSaveDraft}
            className="btn-neumorph"
            style={{ fontSize: "0.86rem", padding: "8px 16px" }}
          >
            Save Draft
          </button>
          <button
            onClick={onSaveResume}
            className="btn-neumorph-primary"
            style={{ fontSize: "0.86rem", padding: "8px 18px" }}
          >
            <Check size={16} />
            <span>Save Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}
