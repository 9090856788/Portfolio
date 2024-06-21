/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageSkills from "./pages/ManageSkills";
import ManageTimeline from "./pages/ManageTimeline";
import ManageProjects from "./pages/ManageProjects";
import ViewProject from "./pages/ViewProject";
import UpdateProject from "./pages/UpdateProject";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
          <Route exact path="/manage/skills" element={<ManageSkills />} />
          <Route exact path="/manage/timeline" element={<ManageTimeline />} />
          <Route exact path="/manage/projects" element={<ManageProjects />} />
          <Route exact path="/view/project/:id" element={<ViewProject />} />
          <Route exact path="/update/project/:id" element={<UpdateProject />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
