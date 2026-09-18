import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  setActiveTab,
  toggleSidebarCollapsed,
  logoutSuccess,
  setToast,
} from "../redux/store";
import { adminLogout } from "../api/adminApi";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  GraduationCap,
  Layers,
  Mail,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  Crown,
  FileCode2,
  MoreVertical,
} from "lucide-react";

/**
 * Premium Neumorphic Admin Sidebar matching the user's demo screens.
 * Seamlessly adapts to light and dark theme modes with soft dual shadows,
 * glowing active navigation indicators, collapsed mini-mode,
 * and quick access to Pro insights and user session.
 */
const AdminSidebar = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.auth.activeTab);
  const isCollapsed = useSelector((state) => state.auth.isSidebarCollapsed);
  const user = useSelector((state) => state.auth.user);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Cpu },
    { id: "timeline", label: "Experience & Edu", icon: GraduationCap },
    { id: "software", label: "Software Tools", icon: Layers },
    { id: "messages", label: "Inquiries & Mail", icon: Mail },
    { id: "profile", label: "Profile Settings", icon: UserCheck },
  ];

  const handleLogout = async () => {
    await adminLogout();
    dispatch(logoutSuccess());
    dispatch(setToast({ type: "info", message: "Signed out successfully" }));
  };

  return (
    <motion.aside
      id="admin-sidebar"
      animate={{ width: isCollapsed ? 84 : 272 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--admin-sidebar-bg)",
        borderRight: "var(--admin-border)",
        boxShadow: "var(--admin-card-shadow)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 14px",
        userSelect: "none",
        overflowX: "hidden",
        overflowY: "auto",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Top Brand & Workspace Identifier */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            padding: isCollapsed ? "4px 0" : "4px 6px",
            marginBottom: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
            }}
            onClick={() => dispatch(setActiveTab("dashboard"))}
          >
            <div
              className="btn-neumorph"
              style={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: 12,
                background: "var(--admin-accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
                padding: 0,
                border: "none",
              }}
            >
              <Code2 size={22} strokeWidth={2.4} />
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "var(--admin-text-primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Kanhu Studio
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--admin-accent)",
                      fontWeight: 600,
                    }}
                  >
                    Admin Workspace
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Collapse Button */}
          {!isCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              className="btn-neumorph"
              style={{
                width: 30,
                height: 30,
                padding: 0,
                borderRadius: 8,
                justifyContent: "center",
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isCollapsed && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              className="btn-neumorph"
              style={{
                width: 34,
                height: 34,
                padding: 0,
                borderRadius: 10,
                justifyContent: "center",
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div
                key={item.id}
                onClick={() => dispatch(setActiveTab(item.id))}
                className={isActive ? "btn-neumorph-primary" : "btn-neumorph"}
                style={{
                  width: "100%",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: isCollapsed ? "11px 0" : "11px 14px",
                  borderRadius: 14,
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 700 : 600,
                  boxShadow: isActive
                    ? "var(--admin-active-nav-shadow)"
                    : "var(--admin-card-shadow-sm)",
                  color: isActive ? "#ffffff" : "var(--admin-text-secondary)",
                }}
                title={isCollapsed ? item.label : ""}
              >
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.16 }}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro Card, Quick Links & User Pill */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {/* Upgrade to Pro Card (As in demo screenshots) */}
        {!isCollapsed && (
          <div
            className="neumorph-card-sm"
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.14) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.28)",
              borderRadius: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Crown size={17} color="#fbbf24" />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--admin-text-primary)" }}>
                Upgrade to Pro
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)", lineHeight: 1.4, margin: 0 }}>
              Unlock advanced analytics and insights.
            </p>
          </div>
        )}

        {/* User Card Pill */}
        <div
          className="neumorph-inset-sm"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: isCollapsed ? "8px" : "10px 12px",
            borderRadius: 14,
            justifyContent: isCollapsed ? "center" : "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 34,
                height: 34,
                minWidth: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {(user?.fullName || "K")[0]}
            </div>

            {!isCollapsed && (
              <div style={{ overflow: "hidden", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "var(--admin-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.fullName || "Kanhu Charan Sahoo"}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--admin-text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.email || "kanhucharansahoo595@gmail.com"}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--admin-text-muted)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
