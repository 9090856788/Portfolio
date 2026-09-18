import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSkills, addSkill, updateSkill, deleteSkill } from "../api/adminApi";
import {
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
  TrendingUp,
  Award,
  Layers,
  Target,
  ChevronRight,
  Sliders,
} from "lucide-react";

/**
 * Technical Skills Management matching Screenshot 1:
 * - Scenic top greeting banner with twilight artwork and goal button
 * - Main calibrated skills list with neumorphic inset tracks and level badges
 * - Right column: 4 stat metric cards (Total, Avg, Learning, Goals)
 * - Skill Proficiency Overview SVG curve line chart
 * - Daily discipline developer quote card
 */
const ManageSkills = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState(85);
  const [svgUrl, setSvgUrl] = useState("");
  const [notice, setNotice] = useState(null);
  const [timeRange, setTimeRange] = useState("Last 6 months");

  const { data: skills = [] } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: fetchSkills,
  });

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Skill added successfully!" });
      setTitle("");
      setProficiency(85);
      setSvgUrl("");
      setModalOpen(false);
      setTimeout(() => setNotice(null), 4000);
    },
    onError: (err) => {
      setNotice({ type: "error", text: err.message || "Failed to add skill" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, prof }) => updateSkill(id, prof),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Proficiency calibrated!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSkills"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNotice({ type: "success", text: "Skill removed!" });
      setTimeout(() => setNotice(null), 3000);
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addMutation.mutate({
      title,
      proficiency: Number(proficiency),
      svgUrl:
        svgUrl ||
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    });
  };

  const getLevelBadge = (val) => {
    if (val >= 90) return { label: "Expert", color: "#10b981", bg: "rgba(16, 185, 129, 0.16)" };
    if (val >= 80) return { label: "Advanced", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.16)" };
    return { label: "Proficient", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.16)" };
  };

  const avgProf = skills.length
    ? Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 80), 0) / skills.length)
    : 92;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Top Scenic Greeting Banner */}
      <div className="scenic-banner">
        <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              opacity: 0.9,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Hello Kanhu</span>
            <span role="img" aria-label="wave">
              👋
            </span>
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Keep Building, Keep Growing!
          </h2>
          <p style={{ fontSize: "0.88rem", opacity: 0.85, marginBottom: 18 }}>
            Small steps every day lead to big results.
          </p>

          <div
            className="btn-neumorph"
            style={{
              background: "rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 9999,
              padding: "7px 16px",
              fontSize: "0.82rem",
            }}
          >
            <span>Your Goal: Become a Senior React Native Developer</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Decorative Sun / Mountain Landscape Graphic */}
        <div
          style={{
            position: "relative",
            width: 140,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.9,
          }}
        >
          <svg width="130" height="90" viewBox="0 0 130 90" fill="none">
            <circle cx="65" cy="35" r="24" fill="#fbbf24" fillOpacity="0.8" />
            <path
              d="M10 80L45 42L70 65L95 32L125 80H10Z"
              fill="#312e81"
              fillOpacity="0.6"
            />
            <path
              d="M30 80L65 48L90 70L115 50L135 80H30Z"
              fill="#4338ca"
              fillOpacity="0.75"
            />
          </svg>
        </div>
      </div>

      {/* Notice Toast */}
      {notice && (
        <div
          className="neumorph-card-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background:
              notice.type === "success"
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
            border:
              notice.type === "success"
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : "1px solid rgba(239, 68, 68, 0.3)",
            color: notice.type === "success" ? "#10b981" : "#ef4444",
            padding: "10px 18px",
          }}
        >
          {notice.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{notice.text}</span>
        </div>
      )}

      {/* Two Column Workspace: Left Manage Skills / Right Stats & Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 24 }}>
        {/* Left Column: Skills List Card */}
        <div className="neumorph-card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
              paddingBottom: 16,
              borderBottom: "1px solid var(--admin-border-subtle)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="neumorph-inset-sm"
                  style={{
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--admin-accent)",
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <h2 style={{ fontSize: "1.18rem", fontWeight: 700, margin: 0 }}>
                  Manage Skills
                </h2>
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--admin-text-secondary)",
                  margin: "6px 0 0",
                }}
              >
                Add and calibrate your technical skill proficiencies displayed on your portfolio resume.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-neumorph-primary"
              style={{ fontSize: "0.84rem", padding: "8px 16px" }}
            >
              <Plus size={16} />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Skills Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {skills.map((skill) => {
              const badge = getLevelBadge(skill.proficiency);

              return (
                <div
                  key={skill._id || skill.id || skill.title}
                  className="neumorph-card-sm"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "14px 18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        className="neumorph-inset-sm"
                        style={{
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 6,
                        }}
                      >
                        {skill.svg?.url || skill.svgUrl ? (
                          <img
                            src={skill.svg?.url || skill.svgUrl}
                            alt={skill.title}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <Sparkles size={16} color="var(--admin-accent)" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                          {skill.title}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 9999,
                          color: badge.color,
                          background: badge.bg,
                        }}
                      >
                        {badge.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "var(--admin-text-primary)",
                          minWidth: 40,
                          textAlign: "right",
                        }}
                      >
                        {skill.proficiency}%
                      </span>
                      <button
                        onClick={() => deleteMutation.mutate(skill._id || skill.id)}
                        className="btn-neumorph-danger"
                        style={{ padding: "6px 8px" }}
                        title="Delete Skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Neumorphic Track & Calibrate Slider */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }} className="progress-track-neumorph">
                      <div
                        className="progress-fill-neumorph"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    {/* Calibrate Slider trigger */}
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={skill.proficiency}
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: skill._id || skill.id,
                          prof: Number(e.target.value),
                        })
                      }
                      style={{
                        width: 80,
                        cursor: "pointer",
                        accentColor: "var(--admin-accent)",
                      }}
                      title="Slide to calibrate proficiency"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 4 Stat Cards + SVG Curve Line Chart + Developer Quote */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* 2x2 Stat Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Total Skills */}
            <div className="stat-card-neumorph" style={{ padding: "16px 18px" }}>
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                  Total Skills
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, margin: "4px 0" }}>
                  {skills.length || 8}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#10b981", fontWeight: 700 }}>
                  ↑ 12% from last month
                </div>
              </div>
              <div
                className="neumorph-inset-sm"
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3b82f6",
                }}
              >
                <Layers size={18} />
              </div>
            </div>

            {/* Avg Proficiency */}
            <div className="stat-card-neumorph" style={{ padding: "16px 18px" }}>
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                  Avg. Proficiency
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, margin: "4px 0" }}>
                  {avgProf}%
                </div>
                <div style={{ fontSize: "0.74rem", color: "#10b981", fontWeight: 700 }}>
                  ↑ 8% overall
                </div>
              </div>
              <div
                className="neumorph-inset-sm"
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                }}
              >
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Learning Now */}
            <div className="stat-card-neumorph" style={{ padding: "16px 18px" }}>
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                  Learning Now
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, margin: "4px 0" }}>3</div>
                <div style={{ fontSize: "0.74rem", color: "#8b5cf6", fontWeight: 700 }}>
                  ↑ 50% target
                </div>
              </div>
              <div
                className="neumorph-inset-sm"
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8b5cf6",
                }}
              >
                <Target size={18} />
              </div>
            </div>

            {/* Goals Achieved */}
            <div className="stat-card-neumorph" style={{ padding: "16px 18px" }}>
              <div>
                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                  Goals Achieved
                </div>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, margin: "4px 0" }}>5</div>
                <div style={{ fontSize: "0.74rem", color: "#f59e0b", fontWeight: 700 }}>
                  ↑ 25% milestone
                </div>
              </div>
              <div
                className="neumorph-inset-sm"
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}
              >
                <Award size={18} />
              </div>
            </div>
          </div>

          {/* Skill Proficiency Overview SVG Curve Chart Card */}
          <div className="neumorph-card" style={{ padding: "20px 22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  Skill Proficiency Overview
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                  Mastery growth trajectory
                </div>
              </div>
              <select
                className="neumorph-inset-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  color: "var(--admin-text-primary)",
                  outline: "none",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <option value="Last 3 months">Last 3 months</option>
                <option value="Last 6 months">Last 6 months</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            {/* Smooth SVG Growth Wave */}
            <div
              className="neumorph-inset"
              style={{
                padding: "16px 12px 10px",
                borderRadius: 16,
                position: "relative",
              }}
            >
              <svg width="100%" height="130" viewBox="0 0 360 130" fill="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M 10 110 Q 70 85 130 90 T 250 40 T 350 20 L 350 120 L 10 120 Z"
                  fill="url(#chartGrad)"
                />
                {/* Main line */}
                <path
                  d="M 10 110 Q 70 85 130 90 T 250 40 T 350 20"
                  stroke="#8b5cf6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Glow points */}
                <circle cx="10" cy="110" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="130" cy="90" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="250" cy="40" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="350" cy="20" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              </svg>
              {/* X-axis labels */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.72rem",
                  color: "var(--admin-text-muted)",
                  marginTop: 6,
                  padding: "0 6px",
                }}
              >
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>
            </div>
          </div>

          {/* Inspirational Developer Quote Card with Mountain Art */}
          <div
            className="neumorph-card"
            style={{
              padding: "18px 20px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--admin-accent-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    lineHeight: 1.45,
                    margin: 0,
                    color: "var(--admin-text-primary)",
                  }}
                >
                  "Discipline today creates the developer you want to be tomorrow."
                </p>
                <span style={{ fontSize: "0.72rem", color: "var(--admin-accent)", fontWeight: 700 }}>
                  Craft & Continuous Growth
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-neumorph">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add Technical Skill
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-neumorph"
                style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, Next.js, TypeScript"
                  className="neumorph-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Proficiency Percentage ({proficiency}%)</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={proficiency}
                    onChange={(e) => setProficiency(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "var(--admin-accent)" }}
                  />
                  <span
                    className="neumorph-inset-sm"
                    style={{
                      padding: "6px 12px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {proficiency}%
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Icon / SVG Logo URL</label>
                <input
                  type="text"
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/..."
                  className="neumorph-input"
                  value={svgUrl}
                  onChange={(e) => setSvgUrl(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-neumorph"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="btn-neumorph-primary"
                >
                  {addMutation.isPending ? "Adding..." : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSkills;
