import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redux/store";
import {
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  Briefcase,
  Wrench,
  Mail,
  ExternalLink,
  ShieldCheck,
  Code2,
} from "lucide-react";

const navLinks = [
  { id: "dashboard", label: "Dashboard & Profile", icon: LayoutDashboard },
  { id: "projects", label: "Manage Projects", icon: FolderGit2 },
  { id: "skills", label: "Manage Skills", icon: Sparkles },
  { id: "timeline", label: "Timeline & Edu", icon: Briefcase },
  { id: "software", label: "Software & Tools", icon: Wrench },
  { id: "messages", label: "Messages Inbox", icon: Mail },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.auth.activeTab);

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Code2 size={22} />
        </div>
        <div>
          <div className="brand-title">Admin Studio</div>
          <div className="brand-subtitle">Portfolio Control Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                dispatch(setActiveTab(item.id));
                if (onClose) onClose();
              }}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="sidebar-footer">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ExternalLink size={15} />
            <span>View Public UI</span>
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)" }}>Live</span>
        </a>

        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={15} />
            <span>Swagger API</span>
          </span>
          <span style={{ fontSize: "0.75rem", color: "#10b981" }}>Docs</span>
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
