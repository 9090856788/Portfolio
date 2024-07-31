/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideNavbar from "./components/Navbar";
import LoginForm from "./components/Login";
import SignUp from "./components/Register";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={SideNavbar} />
          <Route path="/login" Component={LoginForm} />
          <Route path="/signup" Component={SignUp} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
