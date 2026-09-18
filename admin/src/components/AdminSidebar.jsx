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
  Sparkles,
  FileCode2,
} from "lucide-react";

/**
 * Premium auto-resizing collapsible Admin Sidebar
 * Features smooth Framer Motion transitions, tooltip feedback,
 * active indicator glow, and compact mini mode.
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
    dispatch(setToast({ type: "info", message: "Logged out successfully" }));
  };

  return (
    <motion.aside
      id="admin-sidebar"
      animate={{ width: isCollapsed ? 82 : 264 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(18, 22, 38, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.07)",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.35)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 12px",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Top Brand Section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            padding: isCollapsed ? "4px 0" : "4px 8px",
            marginBottom: 24,
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
              style={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 0 16px rgba(99, 102, 241, 0.45)",
              }}
            >
              <Sparkles size={20} />
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#f8fafc", letterSpacing: "-0.01em" }}>
                    Kanhu Studio
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#818cf8", fontWeight: 500 }}>
                    Admin Workspace
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Collapse Button on Desktop */}
          {!isCollapsed && (
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#94a3b8",
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Collapsed Expand Trigger Icon */}
        {isCollapsed && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                color: "#94a3b8",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
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
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(setActiveTab(item.id))}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: isCollapsed ? "11px" : "11px 14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.08) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99, 102, 241, 0.35)"
                    : "1px solid transparent",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  transition: "all 0.2s ease",
                }}
                title={isCollapsed ? item.label : ""}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 4,
                      borderRadius: "0 4px 4px 0",
                      background: "#6366f1",
                      boxShadow: "0 0 10px #6366f1",
                    }}
                  />
                )}

                <Icon size={20} style={{ color: isActive ? "#818cf8" : "inherit" }} />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: isActive ? 600 : 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Swagger API Documentation link */}
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: isCollapsed ? "10px" : "10px 14px",
            borderRadius: "10px",
            color: "#c084fc",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 500,
            background: "rgba(168, 85, 247, 0.08)",
            border: "1px solid rgba(168, 85, 247, 0.2)",
            justifyContent: isCollapsed ? "center" : "flex-start",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          title={isCollapsed ? "Swagger API Docs" : ""}
        >
          <FileCode2 size={17} />
          {!isCollapsed && <span>Swagger API Docs</span>}
        </a>

        {/* Visit Public Portfolio */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: isCollapsed ? "10px" : "10px 14px",
            borderRadius: "10px",
            color: "#60a5fa",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 500,
            background: "rgba(59, 130, 246, 0.08)",
            border: "1px solid rgba(59, 130, 246, 0.18)",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
          title={isCollapsed ? "View Live Portfolio" : ""}
        >
          <ExternalLink size={17} />
          {!isCollapsed && <span>View Live Site</span>}
        </a>

        {/* User Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: isCollapsed ? "8px" : "10px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
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
            <div style={{ overflow: "hidden", flexGrow: 1 }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#e2e8f0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.fullName || "Kanhu Charan Sahoo"}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email || "kanhucharansahoo595@gmail.com"}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              padding: 4,
              display: isCollapsed ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
