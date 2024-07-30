/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { SidebarData } from "../utils/Data";
import { Avatar, Button, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const SideNavbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleMenuItem = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: "10px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f4f4f4",
          marginBottom: 1,
        }}
      >
        <Box
          sx={{
            border: "1px solid red",
            display: "flex",
            alignContent: "center",
            width: "190px",
            height: "40px",
            padding: "2px",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              marginLeft: 1.8,
              cursor: "pointer"
            }}
          />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Kanhu
          </Typography>
        </Box>
      </Box>
      <Box>
        <Sidebar
          collapsed={collapsed}
          width="200px"
          style={{ borderRight: "1px solid red" }}
        >
          <Menu style={{ }}>
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
          <Button onClick={handleToggleMenuItem} sx={{ marginLeft: 1 }}>
            {collapsed ? <ArrowForward /> : <ArrowBack />}
          </Button>
        </Sidebar>
      </Box>
    </>
  );
};

export default SideNavbar;
