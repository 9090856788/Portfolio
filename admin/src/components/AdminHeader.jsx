import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toggleThemeMode, logoutSuccess, setToast, setActiveTab } from "../redux/store";
import { adminLogout, fetchAdminProfile } from "../api/adminApi";
import {
  Search,
  Sun,
  Moon,
  Bell,
  ExternalLink,
  FileCode2,
  Menu,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";

/**
 * Global Admin Header matching the demo design screenshots.
 * Features neumorphic search bar with keyboard shortcut pill,
 * smooth theme switcher (Light / Dark mode), notifications bell,
 * and user profile avatar with actions.
 */
const AdminHeader = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.auth.themeMode);
  const user = useSelector((state) => state.auth.user);

  const { data: profile } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
    staleTime: 60000,
  });

  const displayName = profile?.fullName || user?.fullName || "Admin";
  const displayEmail = profile?.email || user?.email || "admin@gmail.com";
  const displayInitial = (displayName || displayEmail || "A")[0]?.toUpperCase() || "A";

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await adminLogout();
    dispatch(logoutSuccess());
    dispatch(setToast({ type: "info", message: "Signed out of Admin Workspace" }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("proj")) dispatch(setActiveTab("projects"));
    else if (q.includes("skill")) dispatch(setActiveTab("skills"));
    else if (q.includes("time") || q.includes("edu") || q.includes("exp")) dispatch(setActiveTab("timeline"));
    else if (q.includes("soft") || q.includes("tool")) dispatch(setActiveTab("software"));
    else if (q.includes("msg") || q.includes("mail") || q.includes("inbox")) dispatch(setActiveTab("messages"));
    else dispatch(setActiveTab("dashboard"));
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        marginBottom: 28,
        padding: "4px 0",
      }}
    >
      {/* Mobile Toggle & Neumorphic Search Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, maxWidth: 540 }}>
        <button
          onClick={onToggleSidebar}
          className="btn-neumorph"
          style={{ display: "none", padding: "8px 10px" }}
          id="btn-sidebar-toggle"
        >
          <Menu size={18} />
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className="neumorph-inset"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "9px 16px",
            width: "100%",
            borderRadius: 14,
          }}
        >
          <Search size={17} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search skills, projects, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--admin-text-primary)",
              fontSize: "0.88rem",
              width: "100%",
            }}
          />
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 6,
              background: "rgba(148, 163, 184, 0.16)",
              color: "var(--admin-text-muted)",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            ⌘ K
          </span>
        </form>
      </div>

      {/* Right Controls & Quick Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Live Portfolio Quick Link */}
        <a
          href="/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neumorph"
          style={{
            textDecoration: "none",
            fontSize: "0.82rem",
            padding: "8px 14px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          title="Open live public portfolio"
        >
          <ExternalLink size={15} color="var(--admin-accent)" />
          <span style={{ fontWeight: 600 }}>Live Portfolio</span>
        </a>

        {/* Swagger API Quick Link */}
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-neumorph"
          style={{
            textDecoration: "none",
            fontSize: "0.82rem",
            padding: "8px 14px",
            borderRadius: 12,
          }}
          title="Open interactive Swagger REST API explorer"
        >
          <FileCode2 size={15} color="var(--admin-accent)" />
          <span style={{ fontWeight: 600 }}>API Docs</span>
        </a>

        {/* Theme Mode Toggle (Sun/Moon) */}
        <button
          onClick={() => dispatch(toggleThemeMode())}
          className="btn-neumorph"
          style={{
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: 12,
            justifyContent: "center",
          }}
          title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {themeMode === "dark" ? (
            <Sun size={18} color="#f59e0b" />
          ) : (
            <Moon size={18} color="#6366f1" />
          )}
        </button>

        {/* Notifications Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="btn-neumorph"
            style={{
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: 12,
              justifyContent: "center",
              position: "relative",
            }}
            title="Notifications"
          >
            <Bell size={18} color="var(--admin-text-secondary)" />
            <span
              style={{
                position: "absolute",
                top: 9,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#f43f5e",
                boxShadow: "0 0 8px #f43f5e",
              }}
            />
          </button>

          {notificationsOpen && (
            <div
              className="neumorph-card"
              style={{
                position: "absolute",
                top: "115%",
                right: 0,
                width: 280,
                padding: 16,
                zIndex: 60,
              }}
            >
              <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 8 }}>
                Notifications
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "var(--admin-text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Sparkles size={14} color="#10b981" />
                <span>All portfolio systems operational</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Action Dropdown */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="btn-neumorph"
            style={{
              width: 42,
              height: 42,
              padding: 0,
              borderRadius: 14,
              cursor: "pointer",
              overflow: "hidden",
              justifyContent: "center",
            }}
            title={user?.fullName || "Admin Profile"}
          >
            {profile?.avatar?.url ? (
              <img
                src={profile.avatar.url}
                alt={displayName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {displayInitial}
              </div>
            )}
          </div>

          {profileDropdownOpen && (
            <div
              className="neumorph-card"
              style={{
                position: "absolute",
                top: "115%",
                right: 0,
                width: 220,
                padding: 14,
                zIndex: 60,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ padding: "4px 6px 8px", borderBottom: "1px solid var(--admin-border-subtle)" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                  {displayName}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--admin-text-muted)" }}>
                  {displayEmail}
                </div>
              </div>
              <button
                onClick={() => {
                  dispatch(setActiveTab("profile"));
                  setProfileDropdownOpen(false);
                }}
                className="btn-neumorph"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  fontSize: "0.82rem",
                  padding: "6px 10px",
                }}
              >
                <User size={14} />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn-neumorph-danger"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  fontSize: "0.82rem",
                  padding: "6px 10px",
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
