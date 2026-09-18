import React from "react";
import { useSelector } from "react-redux";
import { Menu, FileCode2, ExternalLink } from "lucide-react";

const AdminHeader = ({ onToggleSidebar }) => {
  const activeTab = useSelector((state) => state.auth.activeTab);
  const user = useSelector((state) => state.auth.user);

  const tabTitles = {
    dashboard: "Dashboard & Profile Settings",
    projects: "Manage Portfolio Projects",
    skills: "Manage Technical Skills",
    timeline: "Career & Education Milestones",
    software: "Developer Tools & Software",
    messages: "Contact Inquiries Inbox",
  };

  return (
    <header className="admin-header">
      <div className="header-title-wrap">
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ display: "none" }}
          id="btn-sidebar-toggle"
        >
          <Menu size={18} />
        </button>
        <h2 className="header-title">{tabTitles[activeTab] || "Admin Panel"}</h2>
      </div>

      <div className="header-actions">
        {/* Swagger API Quick Link */}
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            borderRadius: "9px",
            backgroundColor: "rgba(139, 92, 246, 0.12)",
            border: "1px solid rgba(139, 92, 246, 0.28)",
            color: "#c084fc",
            fontSize: "0.82rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          title="Open Swagger REST API interactive explorer"
        >
          <FileCode2 size={15} />
          <span>API Docs</span>
          <ExternalLink size={12} style={{ opacity: 0.7 }} />
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            {user?.fullName?.charAt(0) || "K"}
          </div>
          <div style={{ display: "none" }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{user?.fullName || "Kanhu Charan Sahoo"}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.role || "Administrator"}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
