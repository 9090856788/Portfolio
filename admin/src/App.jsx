import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { clearToast } from "./redux/store";
import AdminSidebar from "./components/AdminSidebar";
import AdminAuth from "./components/AdminAuth";
import Dashboard from "./pages/Dashboard";
import ManageProjects from "./pages/ManageProjects";
import ManageSkills from "./pages/ManageSkills";
import ManageTimeline from "./pages/ManageTimeline";
import ManageSoftware from "./pages/ManageSoftware";
import MessagesInbox from "./pages/MessagesInbox";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import "./style.css";

/**
 * Main Admin Application shell.
 * Coordinates view state, authentication guard, collapsible layout,
 * and floating toast notifications.
 */
export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const activeTab = useSelector((state) => state.auth.activeTab);
  const toast = useSelector((state) => state.auth.toast);

  // If user is unauthenticated, present the modern Admin Login / Register / OTP Portal
  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "projects":
        return <ManageProjects />;
      case "skills":
        return <ManageSkills />;
      case "timeline":
        return <ManageTimeline />;
      case "software":
        return <ManageSoftware />;
      case "messages":
        return <MessagesInbox />;
      case "profile":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0d111d",
        color: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      {/* Auto-resizing Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Content Workspace */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px",
          background: "radial-gradient(ellipse at 80% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)",
          overflowY: "auto",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating System Toast Alerts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              borderRadius: "14px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background:
                toast.type === "error"
                  ? "rgba(239, 68, 68, 0.9)"
                  : toast.type === "success"
                  ? "rgba(16, 185, 129, 0.9)"
                  : "rgba(99, 102, 241, 0.9)",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {toast.type === "error" && <AlertCircle size={18} />}
            {toast.type === "success" && <CheckCircle2 size={18} />}
            {toast.type === "info" && <Info size={18} />}
            <span>{toast.message}</span>
            <button
              onClick={() => dispatch(clearToast())}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                padding: 2,
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
