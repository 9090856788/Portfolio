import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./pages/Dashboard";
import ManageProjects from "./pages/ManageProjects";
import ManageSkills from "./pages/ManageSkills";
import ManageTimeline from "./pages/ManageTimeline";
import ManageSoftware from "./pages/ManageSoftware";
import MessagesInbox from "./pages/MessagesInbox";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeTab = useSelector((state) => state.auth.activeTab);

  const renderActiveTab = () => {
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content View */}
      <div className="admin-main">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1 }}>{renderActiveTab()}</main>
      </div>
    </div>
  );
};

export default App;
