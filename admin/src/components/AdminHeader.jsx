import React from "react";
import { useSelector } from "react-redux";
import { Menu, User, ExternalLink, ShieldCheck } from "lucide-react";

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
