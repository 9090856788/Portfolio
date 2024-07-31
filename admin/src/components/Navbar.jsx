/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { SidebarData } from "../utils/Data";
import { Button, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import TopNavbar from "./TopNavbar";

const SideNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleMenuItem = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <TopNavbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          height: "100vh", // Full height
        }}
      >
        <Sidebar
          collapsed={collapsed}
          width={collapsed ? "80px" : "200px"} // Adjust width based on collapse state
          breakPoint="md" // Breakpoint for responsive behavior
          style={{
            borderRight: "1px solid #ddd",
            transition: "width 0.3s",
            position: { xs: "absolute", sm: "relative" }, // Position based on screen size
            zIndex: { xs: 1000, sm: "auto" }, // Ensure sidebar is on top on small screens
          }}
        >
          <Menu>
            {SidebarData &&
              SidebarData.map((item) => (
                <MenuItem
                  key={item.id}
                  icon={item.icon}
                  component={<Link to={`/${item.path}`} />}
                  className="menu-item"
                >
                  {item.name}
                </MenuItem>
              ))}
          </Menu>
          <Button
            onClick={handleToggleMenuItem}
            sx={{
              marginLeft: 1,
            }}
          >
            {collapsed ? <ArrowForward /> : <ArrowBack />}
          </Button>
        </Sidebar>
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            marginLeft: { xs: 0, sm: collapsed ? "80px" : "200px" }, // Adjust margin based on sidebar width
            transition: "margin-left 0.3s",
            overflow: "auto", // Handle overflow
          }}
        ></Box>
      </Box>
    </>
  );
};

export default SideNavbar;
